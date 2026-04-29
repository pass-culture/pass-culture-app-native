import { ReactNode } from 'react'

import { Activity } from 'api/gen'
import { RootNavigateParams } from 'features/navigation/navigators/RootNavigator/types'
import { Geoloc } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export interface Venue {
  label: string
  info: string
  venueId: number | null
  activity: Activity | null
  _geoloc?: Geoloc
  banner_url?: string | null
  postalCode?: string | null
  isPermanent?: boolean | null
  isOpenToPublic: boolean
}

export enum Tab {
  OFFERS = 'Offres disponibles',
  INFOS = 'Infos pratiques',
  AGENDA = 'Agenda',
}

export type TabProps<TabKeyType extends string> = {
  tabListRef: React.MutableRefObject<null>
  selectedTab: TabKeyType
  setSelectedTab: (tab: TabKeyType) => void
  tabs: TabKeyType[]
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

export type OpeningHoursStatusState =
  | 'open'
  | 'open-soon'
  | 'close-soon'
  | 'close'
  | 'not-applicable'

export type PastilleType = {
  label: string
  accessibilityLabel: string
}

export type TabType<TabKeyType extends string> = {
  key: TabKeyType
  Icon?: React.FC<AccessibleIcon>
  pastille?: PastilleType
}

export type VenueOffers = {
  hits: Offer[]
  nbHits: number
  headlineOffer?: Offer
}

export type Artist = {
  id: string
  name: string
  image?: string
}

export type VenueOffersArtists = { artists: Artist[] }

export type SearchNavigationConfig = {
  screen: RootNavigateParams[0]
  params?: RootNavigateParams[1]
  withPush?: boolean
  withReset?: boolean
  fromRef?: boolean
}

export type PracticalInformationSection = {
  title: string
  body: ReactNode
  shouldBeDisplayed: boolean
}
