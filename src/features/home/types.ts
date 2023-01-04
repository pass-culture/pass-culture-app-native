import { Tag } from 'libs/contentful'

export enum HomepageModuleType {
  'OffersModule' = 'OffersModule',
  'VenuesModule' = 'VenuesModule',
  'BusinessModule' = 'BusinessModule',
  'RecommendedOffersModule' = 'RecommendedOffersModule',
  'ExclusivityModule' = 'ExclusivityModule',
  'ThematicHighlightModule' = 'ThematicHighlightModule',
}
export type Homepage = {
  tag: Tag[] // TODO(evejulliard): do not import Tag from 'libs/contentful
  id: string
  modules: HomepageModule[]
  thematicHeader?: {
    title?: string
    subtitle?: string
  }
}

export type HomepageModule =
  | OffersModule
  | BusinessModule
  | ExclusivityModule
  | RecommendedOffersModule
  | ThematicHighlightModule
  | VenuesModule

export type OffersModule = {
  type: HomepageModuleType.OffersModule
  id: string
  title: string
  offersModuleParameters: OffersModuleParameters[]
  displayParameters: DisplayParameters
  cover?: string | null
}

type DisplayParameters = {
  title: string
  layout: 'two-items' | 'one-item-medium'
  minOffers: number
  subtitle?: string
}

export type OffersModuleParameters = {
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
  type: HomepageModuleType.BusinessModule
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
  type: HomepageModuleType.ExclusivityModule
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
  type: HomepageModuleType.RecommendedOffersModule
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

export type ThematicHighlightModule = {
  type: HomepageModuleType.ThematicHighlightModule
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  thematicHomeEntryId: string
}

export type VenuesModule = {
  type: HomepageModuleType.VenuesModule
  id: string
  venuesParameters: VenuesParameters[]
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

export const isVenuesModule = (module: HomepageModule): module is VenuesModule => {
  return module.type === HomepageModuleType.VenuesModule
}
export const isOffersModule = (module: HomepageModule): module is OffersModule => {
  return module.type === HomepageModuleType.OffersModule
}
export const isRecommendedOffersModule = (
  module: HomepageModule
): module is RecommendedOffersModule => {
  return module.type === HomepageModuleType.RecommendedOffersModule
}
export const isBusinessModule = (module: HomepageModule): module is BusinessModule => {
  return module.type === HomepageModuleType.BusinessModule
}
export const isExclusivityModule = (module: HomepageModule): module is ExclusivityModule => {
  return module.type === HomepageModuleType.ExclusivityModule
}
export const isThematicHighlightModule = (
  module: HomepageModule
): module is ThematicHighlightModule => {
  return module.type === HomepageModuleType.ThematicHighlightModule
}
