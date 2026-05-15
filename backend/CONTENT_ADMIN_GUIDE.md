# Focus Space — Content Admin Guide

## Accessing the Admin Panel

Navigate to `http://localhost:1337/admin` (dev) or `https://yourstrapi.com/admin` (production).

On first launch, create a superadmin account. Subsequent visits require signing in.

---

## Content Types Overview

| Type | Purpose |
|------|---------|
| Conference | The top-level container — one per event series year |
| Event | Individual occurrences (workshops, webinars, the main conference day) |
| Speaker | Keynotes, panelists, hosts — linked to a conference |
| Programme Session | Schedule items linked to a conference |
| Sponsor | Logos and tier linked to a conference |
| Publication | Downloadable proceedings / briefs linked to a conference |

---

## Creating a New Conference

1. Go to **Content Manager → Conference → Create new entry**
2. Fill required fields:
   - **Title** — e.g. "International Conference on Health Systems Research 2026"
   - **Slug** — URL-safe identifier, e.g. `ichs-2026` (auto-generated or manual)
   - **Year** — numeric year
   - **Status** — set to `draft` while preparing, `upcoming` when ready to publish
3. Optional but recommended:
   - **Theme** — conference theme line shown in italic on the detail page
   - **Description** — full overview paragraph
   - **Start/End Date** — drives countdown timer
   - **Venue** and **Location** — shown on event cards and detail page
   - **Hero Image** / **Banner Image** — upload a 1800×600px image for best results
   - **Featured** — check this to use the conference in the homepage hero
   - **Registration URL** — external link to your registration form
4. Click **Save** (stays in draft), then **Publish** to make it live.

> The seed data creates a `featured: true` conference named ICHS 2025. Update or replace it.

---

## Setting the Featured Conference

Only one conference should be `featured: true` at a time.

1. Open the current featured conference → uncheck **Featured** → Save & Publish
2. Open the new conference → check **Featured** → Save & Publish

The homepage hero will update automatically.

---

## Adding Speakers

1. **Content Manager → Speaker → Create new entry**
2. Required: **Name**, **Role** (keynote / speaker / panelist / host / reviewer)
3. Recommended: **Title** (job title), **Organisation**, **Bio**, **Photo** (square 400×400px)
4. Link to **Conference** using the relation field
5. Save & Publish

---

## Adding Programme Sessions

1. **Content Manager → Programme Session → Create new entry**
2. Required: **Title**, **Start Time** (datetime), **Conference**
3. Optional: **End Time**, **Venue Room**, **Session Type** (Plenary / Panel / Workshop / Oral Presentations), **Description**, **Speakers** (many-to-many)
4. Save & Publish

Sessions are displayed in the programme timeline grouped by day.

---

## Adding Sponsors

1. **Content Manager → Sponsor → Create new entry**
2. Required: **Name**, **Tier** (platinum / gold / silver / bronze / partner), **Conference**
3. Optional: **Logo** (PNG with transparent background, any size), **Website**
4. Save & Publish

Sponsors are displayed grouped by tier, largest first.

---

## Uploading Publications

1. **Content Manager → Publication → Create new entry**
2. Required: **Title**, **Slug**, **Conference**
3. Recommended: **Description**, **Publication Date**, **File** (PDF upload), **Cover Image**
4. Save & Publish

---

## Managing Media

All uploaded files are accessible in **Media Library** (left sidebar).
- Strapi auto-generates `thumbnail`, `small`, `medium`, and `large` formats for images.
- Use the `medium` format for cards (auto-selected by the frontend).
- PDFs and other non-image files are stored as-is.

---

## Draft vs Published

Every content type uses Strapi's **Draft & Publish** system:
- **Draft** — saved but not visible via the public API
- **Published** — live and returned by the frontend

Use drafts to prepare content in advance without it going live.

---

## Statuses Reference

### Conference statuses
| Status | Meaning |
|--------|---------|
| `draft` | Hidden from public API |
| `upcoming` | Registration open, countdown active |
| `active` | Conference is happening now |
| `completed` | Past conference |
| `archived` | Hidden from main listings |

### Event statuses
| Status | Meaning |
|--------|---------|
| `upcoming` | Shown in "Upcoming Events" |
| `past` | Shown in "Past Events" |

---

## Permissions

Public permissions (no login required) are configured automatically on startup for all six content types: `find` and `findOne` operations.

To restrict or expand access, go to **Settings → Users & Permissions Plugin → Roles → Public**.
