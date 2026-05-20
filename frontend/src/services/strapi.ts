import type { Conference, Event, Speaker, ProgrammeSession, Sponsor, Publication } from '../types'
import {
  dummyConferences,
  dummyEvents,
  dummyPastEvents,
  dummySpeakers,
  dummyProgramme,
  dummySponsors,
  dummyPublications,
} from '../data/dummy'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

export function getStrapiMediaUrl(media?: { url?: string } | null): string | undefined {
  if (!media?.url) return undefined
  if (media.url.startsWith('http')) return media.url
  return `${BASE_URL}${media.url}`
}

export function getImageUrl(media?: { url?: string } | null, fallback?: string): string {
  return getStrapiMediaUrl(media) ?? fallback ?? '/placeholder-image.jpg'
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function fetchStrapi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

// ── Conferences ───────────────────────────────────────────────────────────────

export async function getConferences(): Promise<Conference[]> {
  const data = await fetchStrapi<Conference[]>(
    '/conferences?populate[0]=heroImage&populate[1]=bannerImage&sort=startDate:desc&pagination[pageSize]=50'
  )
  return data ?? dummyConferences
}

export async function getFeaturedConference(): Promise<Conference | null> {
  const data = await fetchStrapi<Conference[]>(
    '/conferences?filters[featured][$eq]=true&filters[conferenceStatus][$ne]=draft&populate[0]=heroImage&populate[1]=bannerImage&pagination[pageSize]=1'
  )
  if (data && data.length > 0) return data[0]
  return dummyConferences.find((c) => c.conferenceStatus === 'upcoming') ?? dummyConferences[0] ?? null
}

export async function getUpcomingConferences(): Promise<Conference[]> {
  const data = await fetchStrapi<Conference[]>(
    '/conferences?filters[conferenceStatus][$in][0]=upcoming&filters[conferenceStatus][$in][1]=active&populate[0]=heroImage&populate[1]=bannerImage&sort=startDate:asc&pagination[pageSize]=10'
  )
  return data ?? []
}

export async function getConferenceBySlug(slug: string): Promise<Conference | null> {
  const data = await fetchStrapi<Conference[]>(
    `/conferences?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=heroImage&populate[1]=bannerImage&populate[2]=speakers&populate[3]=sponsors&populate[4]=programmeSessions&populate[5]=events&populate[6]=publications`
  )
  if (data && data.length > 0) return data[0]
  return dummyConferences.find((c) => c.slug === slug) ?? null
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(): Promise<Event[]> {
  const data = await fetchStrapi<Event[]>(
    '/events?filters[status][$eq]=upcoming&populate[0]=image&populate[1]=bannerImage&populate[2]=conference&sort=startDate:asc&pagination[pageSize]=20'
  )
  return data ?? dummyEvents
}

export async function getPastEvents(): Promise<Event[]> {
  const data = await fetchStrapi<Event[]>(
    '/events?filters[status][$eq]=past&populate[0]=image&populate[1]=bannerImage&populate[2]=conference&sort=startDate:desc&pagination[pageSize]=20'
  )
  return data ?? dummyPastEvents
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const data = await fetchStrapi<Event[]>(
    `/events?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=image&populate[1]=bannerImage&populate[2]=conference`
  )
  if (data && data.length > 0) return data[0]
  return [...dummyEvents, ...dummyPastEvents].find((e) => e.slug === slug) ?? null
}

// ── Speakers ──────────────────────────────────────────────────────────────────

export async function getSpeakers(conferenceSlug?: string): Promise<Speaker[]> {
  const filter = conferenceSlug
    ? `&filters[conference][slug][$eq]=${encodeURIComponent(conferenceSlug)}`
    : ''
  const data = await fetchStrapi<Speaker[]>(
    `/speakers?populate[0]=photo&populate[1]=conference${filter}&sort=name:asc&pagination[pageSize]=50`
  )
  return data ?? dummySpeakers
}

// ── Programme Sessions ────────────────────────────────────────────────────────

export async function getProgrammeSessions(conferenceSlug?: string): Promise<ProgrammeSession[]> {
  const filter = conferenceSlug
    ? `&filters[conference][slug][$eq]=${encodeURIComponent(conferenceSlug)}`
    : ''
  const data = await fetchStrapi<ProgrammeSession[]>(
    `/programme-sessions?populate[0]=conference&populate[1]=speakers${filter}&sort=startTime:asc&pagination[pageSize]=100`
  )
  return data ?? dummyProgramme
}

// ── Sponsors ──────────────────────────────────────────────────────────────────

export async function getSponsors(conferenceSlug?: string): Promise<Sponsor[]> {
  const filter = conferenceSlug
    ? `&filters[conference][slug][$eq]=${encodeURIComponent(conferenceSlug)}`
    : ''
  const data = await fetchStrapi<Sponsor[]>(
    `/sponsors?populate[0]=logo&populate[1]=conference${filter}&pagination[pageSize]=50`
  )
  return data ?? dummySponsors
}

// ── Publications ──────────────────────────────────────────────────────────────

export async function getPublications(): Promise<Publication[]> {
  const data = await fetchStrapi<Publication[]>(
    '/publications?populate[0]=file&populate[1]=coverImage&populate[2]=conference&sort=publicationDate:desc&pagination[pageSize]=20'
  )
  return data ?? dummyPublications
}
