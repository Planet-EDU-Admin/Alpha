# Token-efficient production build prompt

Use this prompt with a coding agent after attaching the confirmed print-lab specification. It is intentionally outcome-focused so the agent can inspect the repository rather than receiving repeated implementation detail.

```text
Build a production collaborative photobook editor for book.alfa-cent.com.

Inputs
- This repository and its conventions.
- ATTACHED_PRINT_PROFILE: the supplier-confirmed Fujifilm product/output specification. Never infer missing print values; surface them as blocking configuration.

Users and scope
- Support about 300 authenticated contributors uploading and editing independently over a 2–3 month collection period; high simultaneous concurrency is not a requirement.
- Roles: owner, editor, commenter, viewer. Invite by email/link; show presence and audit history.
- Core editor: upload JPEG/PNG/HEIC, EXIF date grouping, used-count/filter, drag/drop into frames, crop/zoom/reposition, text boxes and typography, layouts/backgrounds/stickers, page add/delete/duplicate/reorder, undo/redo, zoom, thumbnails, preview, autosave, comments, and smart chronological layout.
- Preserve originals. Warn for low effective DPI, overflow, missing fonts, unsafe content, and objects outside safe/bleed areas.

Architecture
- TypeScript web app + accessible responsive UI; PostgreSQL metadata; S3-compatible object storage; WebSocket presence; durable job queue and server-side rendering workers.
- Version spread documents independently with optimistic concurrency/idempotency. Use signed uploads, RBAC on every API, audit logs, quotas/rate limits, malware scanning, encryption, backups, deletion and retention controls.
- Keep a vendor-neutral canonical project JSON model. Implement the print adapter strictly from ATTACHED_PRINT_PROFILE, including dimensions, bleed, colour space/profile, fonts, DPI and package naming. Produce a deterministic immutable export and preflight report.

Delivery order
1. Write ADRs, schema, API contract, threat model, print-profile schema, and test plan.
2. Implement vertical slice: auth -> project -> upload -> one spread -> autosave -> preview -> preflight -> export.
3. Add collaboration and remaining editing tools.
4. Add observability, migration/rollback, seed demo, CI and infrastructure configuration.

Acceptance
- Automated unit/integration/E2E/accessibility/security tests; no critical axe violations.
- Soak and recovery tests prove that 300 contributor accounts can upload over 2–3 months with no lost acknowledged writes; document a modest peak-concurrency assumption separately.
- Resume multipart uploads; reconnect without data loss; deterministic renders from identical input.
- Golden-file output passes supplier validation and a physical proof is signed off.
- Document local setup, deployment, recovery, privacy operations, and known risks.

Before coding: inspect the repo, list assumptions and blockers, propose a phased file-level plan, then implement only the first approved phase. Keep responses concise; report changed files, tests, metrics, and unresolved print-profile fields.
```

## Why this prompt is compact

- It states verifiable outcomes instead of prescribing every component.
- It references the repository rather than restating its contents.
- It separates the canonical model from the vendor adapter, avoiding rework.
- It makes unknown supplier details explicit blockers instead of inventing “standard Fujifilm” values.
