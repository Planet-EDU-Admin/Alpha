# Deployment and contributor-data plan

## Simple frontend deployment

The present package is a frontend prototype. Build `dist/alfa-photobook.zip` with `./scripts/build-release.sh`, upload it to the subdomain document root, and extract it. Any normal HTTPS static host can serve `index.html`, `styles.css`, and `app.js`. `server.py` and the Dockerfile are optional preview conveniences, not an upload database.

Users can open the same responsive interface on a phone or computer and select images directly from that device's file/photo chooser. There is no QR pairing flow.

## What is—and is not—collected today

The prototype reads selected images in the user's browser. It does **not** centrally retain them, and book edits use that browser's `localStorage`. Do not invite 300 contributors until authenticated server-side storage has been implemented and tested.

## Recommended storage design for 300 contributors over 2–3 months

Use private S3-compatible object storage for image bytes and PostgreSQL for searchable metadata. Do not rely on one public web-server folder, and do not encode names or email addresses in filenames.

Suggested private object key:

```text
projects/{project_uuid}/contributors/{contributor_uuid}/originals/{asset_uuid}.{ext}
```

Store the following metadata in the database:

- asset UUID, project UUID, and contributor UUID
- original filename for display only
- object key, MIME type, bytes, pixel dimensions, checksum, and EXIF capture date
- upload timestamp, malware-scan status, consent/license status, and deletion status
- usage records linking the asset to book page/frame IDs and crop/transform data

This provides easy sorting by contributor, capture date, upload date, or page without making storage paths expose personal data. UUID names also prevent collisions such as 300 different `IMG_0001.JPG` files.

## Safety controls

- Require individual accounts and enforce project roles on every request.
- Keep the storage bucket private; issue short-lived signed upload/view URLs.
- Validate file signatures, size and dimensions; scan uploads for malware.
- Encrypt transport with HTTPS and storage at rest.
- Keep originals immutable, create derivatives separately, and record SHA-256 checksums.
- Back up database metadata and enable object versioning; test restoration.
- Publish retention/deletion rules and obtain contributor consent.
- Keep audit logs for upload, edit, download, export, and deletion events.

Server folders are acceptable only for a disposable pilot. If that is unavoidable, place data outside `public_html`, deny direct directory listing, use the same UUID structure, restrict OS permissions to the application user, and maintain an encrypted off-server backup.

## Printer handoff

Do not send the raw upload tree to the printer. Freeze an approved book version and generate an immutable export package:

```text
print-export-{project_uuid}-{version}/
  manifest.json
  preflight-report.pdf
  pages/001.pdf (or supplier-required page files)
  checksums.sha256
```

The manifest should identify the book version, page order, trim/bleed profile, output color profile, fonts, render timestamp, and checksum of every output. The package format must match the selected Fujifilm lab's written specification and should pass a physical proof before the final order.

## Capacity clarification

The requirement is approximately 300 total contributors across 2–3 months, not 300 simultaneous users. This removes the need for an unusually large real-time system, but it does not reduce the requirements for authentication, private durable storage, backups, auditability, consent, and deterministic printer export.
