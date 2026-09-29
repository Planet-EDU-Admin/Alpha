# Alfa Memories — collaborative photobook

A dependency-free, responsive proof of concept for a photobook editor intended for an `*.alfa-cent.com` deployment. It supports choosing files directly from the current phone or computer, editable captions, reusable layouts, selectable photo frames, page navigation, local autosave, preview mode, and a portable project export.

The interaction model was refined against the supplied Fotomax screenshots: a persistent tool rail and photo library sit beside the spread, selected frames expose resize handles and quick actions, canvas views are grouped above the work area, and page thumbnails remain visible below it. No phone-pairing step is required.

## Run locally

```bash
python3 server.py
```

Open <http://localhost:4173>.

## Create a hosting package

```bash
./scripts/build-release.sh
```

Upload the generated `dist/alfa-photobook.zip` to an HTTPS static host and extract it. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the production contributor-data and printer-handoff design.

The current prototype does not centrally collect contributor files. Production storage must be added before inviting users; the recommended private object-storage layout, metadata, security controls, and printer export structure are documented in the deployment guide.

## Delivery plan

1. **Validate print specifications.** Obtain the exact Fujifilm partner product specification (trim size, bleed, safe area, colour profile, accepted PDF/JPEG package, DPI, and ordering API) from the selected lab. These requirements vary by product and must not be guessed.
2. **Product foundation.** Deploy the editor on a dedicated subdomain behind a CDN. Use an authenticated API, PostgreSQL for project metadata, object storage for originals/renders, and a queue for thumbnails and print exports.
3. **Collection for 300 users over 2–3 months.** Use individual accounts, role-based project membership, signed uploads, audit history, quotas, and conflict-safe updates. Size ordinary peak capacity separately; 300 simultaneous editors are not required.
4. **Editor MVP.** Implement uploads, layouts, photo transforms, text styles, page operations, undo/redo, comments, autosave, accessible keyboard controls, and responsive review mode.
5. **Print pipeline.** Retain original images; preflight effective DPI, font embedding, bleed, colour conversion, and safe zones; render immutable output server-side; and package it to the printer's confirmed schema.
6. **Security and operations.** Add malware scanning, signed object URLs, encryption, deletion/retention controls, consent notices, backups, monitoring, and recovery drills.
7. **Pilot and launch.** Test with the Hong Kong supplier, proof physical copies, run browser/accessibility/load tests, then progressively release.

## Print interchange

The prototype exports a vendor-neutral JSON project manifest. It deliberately labels this output as a draft rather than claiming Fujifilm compliance. A production exporter should transform the canonical project model into the exact lab profile selected in step 1. See [`docs/BUILD_PROMPT.md`](docs/BUILD_PROMPT.md) for an implementation prompt and acceptance criteria.

## Prototype limitations

- Browser-only project editing; central authenticated contributor storage is not implemented yet
- Uploaded images are stored as data URLs, suitable for demos only
- Export is a project manifest, not a print-ready PDF
- Decorative demo images are CSS-generated placeholders
