export enum HomepageModuleType {
  'OffersModule' = 'OffersModule',
  'VenuesModule' = 'VenuesModule',
  'BusinessModule' = 'BusinessModule',
  'RecommendedOffersModule' = 'RecommendedOffersModule',
  'ExclusivityModule' = 'ExclusivityModule',
  'ThematicHighlightModule' = 'ThematicHighlightModule',
  'CategoryListModule' = 'CategoryListModule',
}

export type HomepageTag = 'master' | 'usergrandpublic' | 'userunderage'

export enum ThematicHeaderType {
  'Default' = 'Default',
  'Highlight' = 'Highlight',
  'Category' = 'Category',
}

export type DefaultThematicHeader = {
  type: ThematicHeaderType.Default
  title?: string
  subtitle?: string
}

export type HighlightThematicHeader = {
  type: ThematicHeaderType.Highlight
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  introductionTitle?: string
  introductionParagraph?: string
}

export type CategoryThematicHeader = {
  type: ThematicHeaderType.Category
  title: string
  subtitle?: string
  imageUrl: string
}

export type ThematicHeader =
  | DefaultThematicHeader
  | HighlightThematicHeader
  | CategoryThematicHeader

export type Homepage = {
  tags: HomepageTag[]
  id: string
  modules: HomepageModule[]
  thematicHeader?: ThematicHeader
}

export type HomepageModule =
  | OffersModule
  | BusinessModule
  | ExclusivityModule
  | RecommendedOffersModule
  | ThematicHighlightModule
  | VenuesModule
  | CategoryListModule

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
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  newestOnly?: boolean
  hitsPerPage: number
  minBookingsThreshold?: number
  movieGenres?: string[]
  musicTypes?: string[]
  showTypes?: string[]
  bookTypes?: string[]
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

export type RecommendedOffersParameters = {
  categories?: string[]
  beginningDatetime?: string
  endingDatetime?: string
  upcomingWeekendEvent?: boolean
  eventDuringNextXDays?: number
  currentWeekEvent?: boolean
  newestOnly?: boolean
  isEvent?: boolean
  priceMin?: number
  priceMax?: number
  subcategories?: string[]
  isDuo?: boolean
  isRecoShuffled?: boolean
  modelEndpoint?: string
  bookTypes?: string[]
  movieGenres?: string[]
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

export type CategoryListModule = {
  id: string
  type: HomepageModuleType.CategoryListModule
  title: string
  categoryBlockList: CategoryBlock[]
}

export type CategoryBlock = {
  id: string
  title: string
  homeEntryId: string
  image?: string
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

export const isCategoryListModule = (module: HomepageModule): module is CategoryListModule => {
  return module.type === HomepageModuleType.CategoryListModule
}
