import { Geoloc } from 'libs/algolia'
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

export type TabArrowNavigationProps = {
  tabListRef: React.MutableRefObject<null>
  selectedTab: Tab
  setSelectedTab: (tab: Tab) => void
  tabs: Tab[]
}
