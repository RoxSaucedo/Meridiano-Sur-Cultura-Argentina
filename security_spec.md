# Security Specification — Meridiano Sur

## Data Invariants
1. **Identity Integrity**: Every user document under `/users/{userId}/...` must have `uid`/`userId` strictly matching `userId` and `request.auth.uid`, and `email_verified == true`.
2. **PII Isolation**: Private account info (`/users/{userId}/private/info`) is readable and writable exclusively by the account owner (`isOwner(userId)`).
3. **Immutable Audit Fields**: `createdAt` must equal `request.time` on creation and cannot be altered on update. `authorUid` and `uid` are immutable.
4. **Strict Payload Boundaries**: Every string has explicit `.size()` bounds, IDs match `^[a-zA-Z0-9_\\-]+$`, and `hasOnly` / `hasAll` prevent shadow fields.
5. **Query Enforcer**: `allow list` on `/recommendations` checks `resource.data.isPublic == true`, and `allow list` on `/users/{userId}/savedItems` checks `resource.data.userId == request.auth.uid`.

## Dirty Dozen Adversarial Payloads
1. Unauthenticated write to `/recommendations/fake-1` -> PERMISSION_DENIED
2. Unverified email (`email_verified: false`) write to `/users/u1/public/profile` -> PERMISSION_DENIED
3. Shadow field (`isAdmin: true`) injected in `/users/u1/public/profile` -> PERMISSION_DENIED
4. Identity spoofing (`authorUid: 'victim'`) in `/recommendations/rec-1` -> PERMISSION_DENIED
5. Reading another user's private PII `/users/victim/private/info` -> PERMISSION_DENIED
6. Reading another user's saved list `/users/victim/savedItems/lib-ficciones` -> PERMISSION_DENIED
7. Poisoned oversized document ID (>128 chars or invalid chars) -> PERMISSION_DENIED
8. Client-spoofed `createdAt` timestamp not equal to `request.time` -> PERMISSION_DENIED
9. Mutating `authorUid` or `createdAt` during recommendation update -> PERMISSION_DENIED
10. Injecting >1500 char essay or >400 char summary in `/recommendations` -> PERMISSION_DENIED
11. Invalid category enum (`category: 'cripto'`) in `/recommendations` -> PERMISSION_DENIED
12. Deleting another user's recommendation -> PERMISSION_DENIED
