# security_spec.md

## Data Invariants
1. A reflection document must belong to a signed-in user.
2. The `userId` in the document must match the `request.auth.uid`.
3. The `createdAt` field must be set to the server timestamp during creation and remain immutable.
4. Users can only read reflections where `userId` matches their own UID.
5. Users cannot update reflections once created (in this app, reflections are saved once after analysis).
6. Reflections must have an analysis object with exactly 3 strengths, 2 challenges, and 3 suggestions.

## The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to create a reflection with `userId` of another user.
2. **Unauthenticated Write**: Attempt to create a reflection without being signed in.
3. **Malicious ID**: Attempt to create a reflection with a document ID that is 1MB of junk characters.
4. **Bypassing Analysis**: Attempt to create a reflection without the `analysis` object.
5. **Schema Poisoning**: Attempt to add a `isVerified: true` field to a reflection.
6. **Self-Promotion**: Attempt to read reflections belonging to another user.
7. **Timestamp Fraud**: Attempt to provide a client-side date for `createdAt` instead of `request.time`.
8. **Resource Exhaustion**: Send a reflection with 1MB of text in `originalText`.
9. **Update Hijack**: Attempt to update a reflection belonging to another user.
10. **State Corruption**: Attempt to update the `analysis` of an existing reflection.
11. **PII Leak**: Attempt a list query that fetches all reflections without filtering by `userId`.
12. **Array Overload**: Send an analysis with 100 strengths instead of 3.

## Test Runner (firestore.rules.test.ts placeholder)
(In a real CI environment, this would run against local emulator)
