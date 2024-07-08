import { Geoloc } from 'libs/algolia/types'
import { VenueTypeCode } from 'libs/parsers/venueType'

export interface Venue {
  label: string
  info: string
  venueId: number | null
  _geoloc?: Geoloc
  banner_url?: string | null
  venue_type?: VenueTypeCode | null
  postalCode?: string | null
}

export enum Tab {
  OFFERS = 'Offres disponibles',
  INFOS = 'Infos pratiques',
}

export type TabKey = string

export type TabProps<T extends TabKey> = {
  tabListRef: React.MutableRefObject<null>
  selectedTab: T
  setSelectedTab: (tab: T) => void
  tabs: T[]
}

export type OpeningHours = Partial<{
  MONDAY: OpeningHour[]
  TUESDAY: OpeningHour[]
  WEDNESDAY: OpeningHour[]
  THURSDAY: OpeningHour[]
  FRIDAY: OpeningHour[]
  SATURDAY: OpeningHour[]
  SUNDAY: OpeningHour[]
}>

export type OpeningHour = {
  open: string
  close: string
}

export type OpeningHoursStatusState = 'open' | 'open-soon' | 'close-soon' | 'close'
