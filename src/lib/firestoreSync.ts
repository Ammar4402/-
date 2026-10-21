import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface GlobalStatsData {
  totalPrayers: number;
  totalSurahsRead: number;
  uniqueSupporters: number;
  updatedAt?: Timestamp | null;
}

export interface VisitorMessageData {
  id: string;
  name: string;
  text: string;
  amenCount: number;
  createdAt: Date;
}

const GLOBAL_STATS_PATH = 'stats/global';
const MESSAGES_PATH = 'messages';
const DUA_STATS_PATH = 'dua_stats';
const PARTICIPANT_KEY = 'bahaa_memorial_active_participant_v1';

// Clean zero baseline
const INITIAL_STATS: GlobalStatsData = {
  totalPrayers: 0,
  totalSurahsRead: 0,
  uniqueSupporters: 0,
};

// Reset Firestore stats doc to 0
export async function resetGlobalStatsToZero(): Promise<void> {
  const statsDocRef = doc(db, 'stats', 'global');
  try {
    await setDoc(statsDocRef, {
      totalPrayers: 0,
      totalSurahsRead: 0,
      uniqueSupporters: 0,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, GLOBAL_STATS_PATH);
  }
}

// Listen to Global Stats
export function subscribeToGlobalStats(
  callback: (stats: GlobalStatsData) => void
): () => void {
  const statsDocRef = doc(db, 'stats', 'global');
  return onSnapshot(
    statsDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as GlobalStatsData;
        callback({
          totalPrayers: typeof data.totalPrayers === 'number' ? data.totalPrayers : 0,
          totalSurahsRead: typeof data.totalSurahsRead === 'number' ? data.totalSurahsRead : 0,
          uniqueSupporters: typeof data.uniqueSupporters === 'number' ? data.uniqueSupporters : 0,
          updatedAt: data.updatedAt || null,
        });
      } else {
        setDoc(statsDocRef, {
          ...INITIAL_STATS,
          updatedAt: serverTimestamp(),
        }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, GLOBAL_STATS_PATH);
        });
        callback(INITIAL_STATS);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, GLOBAL_STATS_PATH);
    }
  );
}

// Record unique active supporter on their first prayer/action
export function recordUserActionParticipation(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(PARTICIPANT_KEY)) {
      return false; // Already recorded for this browser
    }

    localStorage.setItem(PARTICIPANT_KEY, 'true');

    const statsDocRef = doc(db, 'stats', 'global');
    updateDoc(statsDocRef, {
      uniqueSupporters: increment(1),
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      console.warn('Could not increment unique supporters in cloud:', err);
    });

    return true; // Newly counted supporter!
  } catch {
    return false;
  }
}

// Batched high-speed increment queue for smooth, non-blocking rapid clicking
let pendingPrayersDelta = 0;
let prayerFlushTimer: ReturnType<typeof setTimeout> | null = null;

async function flushPrayersQueue(): Promise<void> {
  if (pendingPrayersDelta <= 0) return;
  const delta = pendingPrayersDelta;
  pendingPrayersDelta = 0;

  const statsDocRef = doc(db, 'stats', 'global');
  try {
    await updateDoc(statsDocRef, {
      totalPrayers: increment(delta),
      updatedAt: serverTimestamp(),
    });
  } catch {
    try {
      await setDoc(
        statsDocRef,
        {
          totalPrayers: increment(delta),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to flush prayers delta to Firestore:', err);
    }
  }
}

// Increment prayers count smoothly with queue flush
export function incrementGlobalPrayers(amount: number = 1): void {
  pendingPrayersDelta += amount;
  if (prayerFlushTimer) {
    clearTimeout(prayerFlushTimer);
  }

  // Flush immediately if accumulated 8+ clicks, or after 300ms pause
  if (pendingPrayersDelta >= 8) {
    flushPrayersQueue();
  } else {
    prayerFlushTimer = setTimeout(() => {
      flushPrayersQueue();
    }, 300);
  }
}

// Increment surahs read
export async function incrementGlobalSurahsRead(): Promise<void> {
  const statsDocRef = doc(db, 'stats', 'global');
  try {
    await updateDoc(statsDocRef, {
      totalSurahsRead: increment(1),
      totalPrayers: increment(10), // A completed surah adds 10 to prayers
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, GLOBAL_STATS_PATH);
  }
}

// Listen to Visitor Messages
export function subscribeToMessages(
  callback: (messages: VisitorMessageData[]) => void
): () => void {
  const messagesCol = collection(db, MESSAGES_PATH);
  const q = query(messagesCol, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: VisitorMessageData[] = snapshot.docs.map((d) => {
        const data = d.data();
        let createdAt = new Date();
        if (data.createdAt instanceof Timestamp) {
          createdAt = data.createdAt.toDate();
        }
        return {
          id: d.id,
          name: data.name || 'فاعل خير',
          text: data.text || '',
          amenCount: typeof data.amenCount === 'number' ? data.amenCount : 0,
          createdAt,
        };
      });
      callback(messages);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, MESSAGES_PATH);
    }
  );
}

// Add a new visitor message
export async function addVisitorMessage(name: string, text: string): Promise<void> {
  const cleanName = (name.trim() || 'محب للمرحوم').slice(0, 60);
  const cleanText = text.trim().slice(0, 1000);
  if (!cleanText) return;

  try {
    await addDoc(collection(db, MESSAGES_PATH), {
      name: cleanName,
      text: cleanText,
      amenCount: 0,
      createdAt: serverTimestamp(),
    });

    // Also contribute to prayers count
    incrementGlobalPrayers(1);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, MESSAGES_PATH);
  }
}

// Increment Ameen count on a message
export async function incrementMessageAmen(messageId: string): Promise<void> {
  const docRef = doc(db, MESSAGES_PATH, messageId);
  try {
    await updateDoc(docRef, {
      amenCount: increment(1),
    });
    // Ameen is also a prayer
    incrementGlobalPrayers(1);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MESSAGES_PATH}/${messageId}`);
  }
}

// Listen to individual Dua recitation stats
export function subscribeToDuaStats(
  callback: (statsMap: Record<string, number>) => void
): () => void {
  const colRef = collection(db, DUA_STATS_PATH);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const map: Record<string, number> = {};
      snapshot.docs.forEach((d) => {
        const count = d.data().count;
        if (typeof count === 'number') {
          map[d.id] = count;
        }
      });
      callback(map);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, DUA_STATS_PATH);
    }
  );
}

// Increment individual Dua recitation
export async function incrementDuaCounter(duaId: string): Promise<void> {
  const docRef = doc(db, DUA_STATS_PATH, duaId);
  try {
    await updateDoc(docRef, {
      count: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch {
    try {
      await setDoc(
        docRef,
        {
          count: 1,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${DUA_STATS_PATH}/${duaId}`);
    }
  }
}
