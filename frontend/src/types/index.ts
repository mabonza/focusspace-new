// ── Strapi 5 response format (no `attributes` wrapper) ──────────────────────

export interface StrapiMeta {
  pagination: { page: number; pageSize: number; pageCount: number; total: number }
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: StrapiMeta
}

export interface StrapiMedia {
  id: number
  documentId?: string
  url: string
  alternativeText?: string
  width?: number
  height?: number
  formats?: {
    thumbnail?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
  }
}

// ── Auth / User ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  documentId?: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  institution?: string
  country?: string
  userRole: 'attendee' | 'presenter' | 'reviewer' | 'organizer' | 'admin'
  createdAt?: string
}

export interface LoginResponse {
  jwt: string
  user: AuthUser
}

// ── Domain models (flat, Strapi 5 style) ─────────────────────────────────────

export interface Conference {
  id: number
  documentId?: string
  title: string
  slug: string
  year?: number
  theme?: string
  description?: string
  startDate?: string
  endDate?: string
  venue?: string
  location?: string
  heroImage?: StrapiMedia
  bannerImage?: StrapiMedia
  conferenceStatus: 'draft' | 'upcoming' | 'active' | 'completed' | 'archived'
  featured: boolean
  registrationOpen: boolean
  abstractSubmissionOpen: boolean
  registrationUrl?: string
  hostedBy?: string
  preconferenceStartDate?: string
  preconferenceEndDate?: string
  backgroundContext?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  conferenceFee?: number
  preconferenceFee?: number
  subThemes?: { title: string; points?: string[] }[]
  importantDates?: { label: string; date: string }[]
  events?: Event[]
  speakers?: Speaker[]
  programmeSessions?: ProgrammeSession[]
  sponsors?: Sponsor[]
  publications?: Publication[]
}

export interface Event {
  id: number
  documentId?: string
  title: string
  slug: string
  type: 'conference' | 'summit' | 'pre-conference' | 'workshop' | 'webinar'
  status: 'upcoming' | 'past'
  shortDescription?: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  venue?: string
  image?: StrapiMedia
  bannerImage?: StrapiMedia
  registrationUrl?: string
  conference?: Conference
}

export interface Speaker {
  id: number
  documentId?: string
  name: string
  title?: string
  organisation?: string
  bio?: string
  photo?: StrapiMedia
  role: 'host' | 'keynote' | 'speaker' | 'panelist' | 'reviewer'
  conference?: Conference
}

export interface ProgrammeSession {
  id: number
  documentId?: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  venueRoom?: string
  sessionType?: string
  conference?: Conference
  speakers?: Speaker[]
}

export interface Sponsor {
  id: number
  documentId?: string
  name: string
  logo?: StrapiMedia
  website?: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner'
  conference?: Conference
}

export interface Publication {
  id: number
  documentId?: string
  title: string
  slug: string
  description?: string
  file?: StrapiMedia
  coverImage?: StrapiMedia
  publicationDate?: string
  conference?: Conference
}

// ── Phase 2: Operational types ────────────────────────────────────────────────

export interface ConferenceRegistration {
  id: number
  documentId?: string
  titlePrefix?: string
  phone?: string
  institution?: string
  billingAddress1?: string
  billingAddress2?: string
  city?: string
  stateProvince?: string
  postalCode?: string
  country?: string
  vatNumber?: string
  preconferenceAttendance?: boolean
  abstractSubmission?: boolean
  conferenceFee?: number
  preconferenceFee?: number
  totalFee?: number
  registrationType: 'in-person' | 'virtual' | 'hybrid'
  ticketCategory: 'standard' | 'student' | 'early-bird' | 'vip'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  invoiceNumber?: string
  qrCode?: string
  attendanceStatus: 'registered' | 'attended' | 'no-show' | 'cancelled'
  createdAt?: string
  user?: AuthUser
  conference?: Conference
  invoice?: Invoice
}

export type AbstractStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'revision-requested'
  | 'accepted'
  | 'rejected'

export interface Abstract {
  id: number
  documentId?: string
  title: string
  abstractText: string
  keywords?: string
  subtheme?: string
  coAuthors?: string
  institution?: string
  documentUpload?: StrapiMedia
  status: AbstractStatus
  presentationType: 'oral' | 'poster' | 'workshop' | 'virtual'
  reviewerComments?: string
  adminComments?: string
  createdAt?: string
  updatedAt?: string
  user?: AuthUser
  conference?: Conference
  assignedReviewer?: AuthUser
  reviews?: Review[]
}

export interface Review {
  id: number
  documentId?: string
  score?: number
  comments?: string
  recommendation: 'accept' | 'reject' | 'revise'
  submittedAt?: string
  reviewer?: AuthUser
  abstract?: Abstract
}

export interface Invoice {
  id: number
  documentId?: string
  invoiceNumber: string
  amount?: number
  currency: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  issuedDate?: string
  registration?: ConferenceRegistration
}

export interface Notification {
  id: number
  documentId?: string
  title: string
  message: string
  type: 'registration' | 'abstract' | 'review' | 'payment' | 'system'
  readStatus: boolean
  createdAt?: string
  user?: AuthUser
}

// ── Phase 3: Business operations types ───────────────────────────────────────

export type PaymentStatus = 'pending' | 'under-review' | 'approved' | 'rejected'
export type PaymentMethod = 'eft' | 'bank_transfer' | 'cash' | 'card' | 'mobile_money'

export interface Payment {
  id: number
  documentId?: string
  amount?: number
  currency: string
  paymentMethod: PaymentMethod
  paymentReference?: string
  paymentProof?: StrapiMedia
  status: PaymentStatus
  verifiedAt?: string
  notes?: string
  createdAt?: string
  user?: AuthUser
  registration?: ConferenceRegistration
  invoice?: Invoice
  verifiedBy?: AuthUser
}

export type CertificateType = 'attendee' | 'speaker' | 'presenter' | 'reviewer' | 'organizer'

export interface Certificate {
  id: number
  documentId?: string
  certificateType: CertificateType
  certificateId?: string
  verificationCode?: string
  issuedDate?: string
  pdfFile?: StrapiMedia
  user?: AuthUser
  conference?: Conference
}

export type AttendanceStatus = 'registered' | 'checked-in' | 'absent'

export interface Attendance {
  id: number
  documentId?: string
  qrCode?: string
  checkedInAt?: string
  attendanceStatus: AttendanceStatus
  user?: AuthUser
  conference?: Conference
  checkedInBy?: AuthUser
}

export interface AnalyticsOverview {
  totalConferences: number
  totalRegistrations: number
  totalAbstracts: number
  totalReviews: number
  totalPayments: number
  pendingPayments: number
  approvedPayments: number
  totalCertificates: number
  totalAttendees: number
  totalRevenue: number
  abstractBreakdown: { status: string; count: number }[]
}

export interface CertificateVerification {
  valid: boolean
  certificateId: string
  certificateType: CertificateType
  issuedDate: string
  holder: { firstName?: string; lastName?: string; email?: string }
  conference: { title?: string; year?: number; location?: string }
}
