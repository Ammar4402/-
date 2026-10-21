# Security Specification: Memorial & Sadaqah Jariyah

## Phase 0: Data Invariants
1. `VisitorMessage`: A prayer message must have `name` (string, 1-60 chars), `text` (string, 1-1000 chars), `amenCount` (number >= 0), and valid `createdAt`. Deletion or malicious updates to text are disallowed. Only `amenCount` may be incremented.
2. `GlobalStats`: Document at `/stats/global` tracks counters `totalPrayers`, `totalSurahsRead`, and `uniqueSupporters`. Values must be positive numbers and cannot be decremented or deleted.
3. `DuaCounter`: Counter per dua ID. Must have positive `count`.
4. Test connection path `/test/connection`: Read-only probe for client health check.

## The "Dirty Dozen" Payloads (Must be rejected)
1. **Ghost Field in Message**: `{ name: "Ali", text: "رحمه الله", amenCount: 0, createdAt: request.time, isAdmin: true }` -> REJECT (Key injection).
2. **Oversized Text in Message**: `{ name: "Ali", text: "<10,000 characters>", amenCount: 0, createdAt: request.time }` -> REJECT (Denial of Wallet).
3. **Empty Text in Message**: `{ name: "Ali", text: "", amenCount: 0, createdAt: request.time }` -> REJECT (Empty content).
4. **Negative Ameen Count**: `{ name: "Ali", text: "رحمه الله", amenCount: -5, createdAt: request.time }` -> REJECT (Value violation).
5. **Arbitrary Message Update**: Modifying `text` of another visitor's prayer -> REJECT (Integrity breach).
6. **Message Delete Attempt**: Unauthorized document delete -> REJECT.
7. **Negative Stats Count**: `{ totalPrayers: -100 }` -> REJECT.
8. **Stat Document Deletion**: Deleting `/stats/global` -> REJECT.
9. **Injection into Dua ID**: Document path with symbols or > 128 chars -> REJECT.
10. **Spoofed CreatedAt**: `createdAt: timestamp_in_future` -> REJECT.
11. **Random Collection Write**: Writing to `/admin_secrets/passwords` -> REJECT (Catch-all deny).
12. **Ameen Decrement or Multi-jump**: Trying to increment `amenCount` by +1000 at once -> REJECT.
