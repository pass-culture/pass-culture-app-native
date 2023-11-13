import { Geoloc } from 'libs/algolia'

export interface Venue {
  label: string
  info: string
  venueId: number | null
  _geoloc?: Geoloc
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
