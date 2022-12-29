export type Homepage = {
  tag: []
  id: string
  modules: HomepageModule[]
  thematicHeaderTitle?: string
  thematicHeaderSubtitle?: string
}

export type HomepageModule =
  | OffersModule
  | BusinessModule
  | ExclusivityModule
  | RecommendedOffersModule
  | VenuesModule

export type OffersModule = {
  id: string
  title: string
  offersModuleParameters: OffersModuleParameters
  displayParameters: DisplayParameters
  cover?: string | null
  additionalOffersModuleParameters?: OffersModuleParameters[]
}

type DisplayParameters = {
  title: string
  layout: 'two-items' | 'one-item-medium'
  minOffers: number
  subtitle?: string
}

type OffersModuleParameters = {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  categories?: string[]
  subcategories?: string[]
  tags?: string[]
  isDigital?: boolean
  isThing?: boolean
  isEvent?: boolean
  beginningDatetime?: string
  endingDatetime?: string
  eventDuringNextXDays?: number
  upcomingWeekendEvent?: boolean
  currentWeekEvent?: boolean
  isFree?: boolean
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  newestOnly?: boolean
  hitsPerPage: number
}

export type BusinessModule = {
  id: string
  analyticsTitle: string
  image: string
  title?: string
  subtitle?: string
  leftIcon?: string
  url?: string
  shouldTargetNotConnectedUsers?: boolean
}

export type ExclusivityModule = {
  id: string
  title: string
  alt: string
  image: string
  offerId?: number
  url?: string
  displayParameters?: ExclusivityDisplayParameters
}

type ExclusivityDisplayParameters = {
  isGeolocated?: boolean
  aroundRadius?: number
}

export type RecommendedOffersModule = {
  id: string
  displayParameters: DisplayParameters
  recommendationParameters?: RecommendedOffersParameters
}

type RecommendedOffersParameters = {
  categories?: string[]
  beginningDatetime?: string
  endingDatetime?: string
  upcomingWeekendEvent?: boolean
  eventDuringNextXDays?: string
  currentWeekEvent?: boolean
  newestOnly?: boolean
  isFree?: boolean
  isEvent?: boolean
  priceMax?: number
  subcategories?: string[]
  isDuo?: boolean
  isRecoShuffled?: boolean
}

export type VenuesModule = {
  id: string
  venuesSearchParameters: VenuesParameters[]
  displayParameters: DisplayParameters
}

type VenuesParameters = {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
}
