# Strapi Backend Setup

## Initialise Strapi

```bash
cd backend
npx create-strapi-app@latest . --quickstart
```

This creates a Strapi 5 project with SQLite (development) in the current directory.

## Collection Types to Create

In the Strapi Admin panel (http://localhost:1337/admin), create the following Content Types:

---

### 1. Conference
| Field               | Type            | Notes                    |
|---------------------|-----------------|--------------------------|
| title               | Text            | Required                 |
| slug                | UID             | From title               |
| year                | Integer         |                          |
| theme               | Text            |                          |
| description         | Long Text / RTE |                          |
| startDate           | Date            |                          |
| endDate             | Date            |                          |
| venue               | Text            |                          |
| location            | Text            |                          |
| heroImage           | Media (single)  |                          |
| bannerImage         | Media (single)  |                          |
| status              | Enumeration     | upcoming, active, past   |
| registrationOpen    | Boolean         |                          |
| abstractSubmissionOpen | Boolean      |                          |

---

### 2. Event
| Field            | Type            | Notes                                             |
|------------------|-----------------|---------------------------------------------------|
| title            | Text            | Required                                          |
| slug             | UID             | From title                                        |
| type             | Enumeration     | conference, summit, pre-conference, workshop, webinar |
| status           | Enumeration     | upcoming, past                                    |
| shortDescription | Text            |                                                   |
| description      | Long Text / RTE |                                                   |
| startDate        | DateTime        |                                                   |
| endDate          | DateTime        |                                                   |
| location         | Text            |                                                   |
| venue            | Text            |                                                   |
| image            | Media (single)  |                                                   |
| bannerImage      | Media (single)  |                                                   |
| registrationUrl  | Text            |                                                   |
| conference       | Relation → Conference (many-to-one) |                           |

---

### 3. Speaker
| Field        | Type            | Notes                                    |
|--------------|-----------------|------------------------------------------|
| name         | Text            | Required                                 |
| title        | Text            |                                          |
| organisation | Text            |                                          |
| bio          | Long Text       |                                          |
| photo        | Media (single)  |                                          |
| role         | Enumeration     | host, keynote, speaker, panelist, reviewer |
| conference   | Relation → Conference (many-to-one) |              |

---

### 4. Programme Session
| Field       | Type            | Notes                  |
|-------------|-----------------|------------------------|
| title       | Text            | Required               |
| description | Long Text       |                        |
| startTime   | DateTime        |                        |
| endTime     | DateTime        |                        |
| venueRoom   | Text            |                        |
| sessionType | Text            | Plenary, Panel, etc.   |
| conference  | Relation → Conference (many-to-one) |    |
| speakers    | Relation → Speaker (many-to-many) |      |

---

### 5. Sponsor
| Field      | Type           | Notes                              |
|------------|----------------|------------------------------------|
| name       | Text           | Required                           |
| logo       | Media (single) |                                    |
| website    | Text           |                                    |
| tier       | Enumeration    | platinum, gold, silver, bronze, partner |
| conference | Relation → Conference (many-to-one) |  |

---

### 6. Publication
| Field           | Type           | Notes    |
|-----------------|----------------|----------|
| title           | Text           | Required |
| slug            | UID            |          |
| description     | Long Text      |          |
| file            | Media (single) |          |
| coverImage      | Media (single) |          |
| publicationDate | Date           |          |
| conference      | Relation → Conference (many-to-one) | |

---

### 7. Page Content
| Field   | Type      | Notes |
|---------|-----------|-------|
| page    | Text      | slug identifier e.g. "home", "about" |
| section | Text      |       |
| content | Rich Text |       |
| order   | Integer   |       |

---

### 8. Media Gallery
| Field      | Type           | Notes |
|------------|----------------|-------|
| title      | Text           |       |
| images     | Media (multiple) |     |
| conference | Relation → Conference (many-to-one) | |

---

## Permissions

In Settings → Users & Permissions → Roles → Public:

Enable `find` and `findOne` for:
- Conference
- Event
- Speaker
- Programme Session
- Sponsor
- Publication
- Page Content
- Media Gallery

## Enable CORS for Frontend

In `config/middlewares.js` (already generated), ensure the following:

```js
'strapi::cors': {
  enabled: true,
  headers: '*',
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
},
```
