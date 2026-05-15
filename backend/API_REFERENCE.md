# Focus Space — API Reference

Base URL: `http://localhost:1337/api` (dev) or your production domain.

All public endpoints require no authentication. Admin endpoints require a Bearer token from `/api/auth/local`.

---

## Conferences

### List conferences
```
GET /api/conferences
```
Query params:
- `?populate=heroImage,bannerImage` — include images
- `?filters[status][$eq]=upcoming` — filter by status
- `?filters[featured][$eq]=true` — featured only
- `?sort=startDate:asc` — sort
- `?pagination[pageSize]=10&pagination[page]=1` — paginate

Example response (Strapi 5 — flat, no `attributes` wrapper):
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "title": "ICHS 2025",
      "slug": "ichs-2025",
      "year": 2025,
      "theme": "Strengthening Health Systems",
      "status": "upcoming",
      "featured": true,
      "registrationOpen": true,
      "abstractSubmissionOpen": true,
      "startDate": "2025-09-15",
      "endDate": "2025-09-18",
      "venue": "Sandton Convention Centre",
      "location": "Johannesburg, South Africa",
      "heroImage": { "id": 1, "url": "/uploads/hero.jpg", "formats": { ... } }
    }
  ],
  "meta": { "pagination": { "page": 1, "pageSize": 25, "total": 2 } }
}
```

### Get single conference by slug
```
GET /api/conferences?filters[slug][$eq]=ichs-2025&populate[heroImage]=*&populate[bannerImage]=*&populate[speakers][populate]=photo&populate[sponsors][populate]=logo&populate[programmeSessions]=*&populate[publications][populate]=coverImage,file&populate[events][populate]=image
```

---

## Events

### Upcoming events
```
GET /api/events?filters[status][$eq]=upcoming&populate=image,bannerImage,conference&sort=startDate:asc&pagination[pageSize]=20
```

### Past events
```
GET /api/events?filters[status][$eq]=past&populate=image,bannerImage,conference&sort=startDate:desc&pagination[pageSize]=20
```

### Event by slug
```
GET /api/events?filters[slug][$eq]=ichs-2025&populate=image,bannerImage,conference
```

Event statuses: `upcoming` | `past`
Event types: `conference` | `summit` | `pre-conference` | `workshop` | `webinar`

---

## Speakers

### All speakers
```
GET /api/speakers?populate=photo,conference&sort=name:asc&pagination[pageSize]=50
```

### Speakers for a specific conference
```
GET /api/speakers?filters[conference][slug][$eq]=ichs-2025&populate=photo,conference&sort=name:asc
```

Speaker roles: `host` | `keynote` | `speaker` | `panelist` | `reviewer`

---

## Programme Sessions

### All sessions
```
GET /api/programme-sessions?populate=conference,speakers&sort=startTime:asc&pagination[pageSize]=100
```

### Sessions for a conference
```
GET /api/programme-sessions?filters[conference][slug][$eq]=ichs-2025&populate=conference,speakers&sort=startTime:asc
```

---

## Sponsors

### All sponsors
```
GET /api/sponsors?populate=logo,conference&pagination[pageSize]=50
```

### Sponsors for a conference
```
GET /api/sponsors?filters[conference][slug][$eq]=ichs-2025&populate=logo,conference
```

Sponsor tiers: `platinum` | `gold` | `silver` | `bronze` | `partner`

---

## Publications

### All publications
```
GET /api/publications?populate=file,coverImage,conference&sort=publicationDate:desc&pagination[pageSize]=20
```

---

## Media URLs

Strapi stores media with relative paths. Prepend the Strapi base URL:
```
https://yourstrapi.com + /uploads/image_abc123.jpg
```

The frontend `getStrapiMediaUrl(media)` helper handles this automatically.

---

## Authentication (Admin / Phase 2)

### Login
```
POST /api/auth/local
Content-Type: application/json

{ "identifier": "user@example.com", "password": "password" }
```

Returns `{ "jwt": "...", "user": { ... } }`. Use JWT as `Authorization: Bearer <jwt>`.

---

## Filtering Operators

| Operator | Meaning |
|----------|---------|
| `[$eq]` | equals |
| `[$ne]` | not equal |
| `[$in]` | in array |
| `[$lt]`, `[$lte]` | less than |
| `[$gt]`, `[$gte]` | greater than |
| `[$contains]` | contains (case-insensitive) |
| `[$null]` | is null |

Example: `?filters[status][$in][0]=upcoming&filters[status][$in][1]=active`
