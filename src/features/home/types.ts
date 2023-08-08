import { VenueAccessibilityModel, VenueContactModel } from 'api/gen'
import { SearchQueryParameters, VenueHit } from 'libs/algolia'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { VenueTypeCode } from 'libs/parsers'
import { Offer } from 'shared/offer/types'

export enum HomepageModuleType {
  'OffersModule' = 'OffersModule',
  'VenuesModule' = 'VenuesModule',
  'BusinessModule' = 'BusinessModule',
  'RecommendedOffersModule' = 'RecommendedOffersModule',
  'ExclusivityModule' = 'ExclusivityModule',
  'ThematicHighlightModule' = 'ThematicHighlightModule',
  'CategoryListModule' = 'CategoryListModule',
  'VideoModule' = 'VideoModule',
  'HighlightOfferModule' = 'HighlightOfferModule',
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
  | VideoModule
  | HighlightOfferModule

export type OffersModule = {
  type: HomepageModuleType.OffersModule
  id: string
  title: string
  offersModuleParameters: OffersModuleParameters[]
  displayParameters: DisplayParameters
  cover?: string | null
  data?: ModuleData
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
  musicTypes?: string[]
  showTypes?: string[]
}

export type ThematicHighlightModule = {
  type: HomepageModuleType.ThematicHighlightModule
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  toThematicHomeEntryId: string
}

export type VenuesModule = {
  type: HomepageModuleType.VenuesModule
  id: string
  venuesParameters: VenuesModuleParameters
  displayParameters: DisplayParameters
  data?: ModuleData
}

export type VenuesModuleParameters = {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
}

export type ModuleData = {
  playlistItems: VenueHit[] | Offer[]
  // The number of hits matched by the query, not the number of hits returned.
  nbPlaylistResults?: number
  moduleId: string
}

export type Venue = {
  accessibility: VenueAccessibilityModel
  description: string
  contact: VenueContactModel
  publicName: string
  bannerUrl?: string
  id: number
  latitude?: number
  longitude?: number
  name: string
  venueTypeCode: VenueTypeCode
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

export enum Color {
  Gold = 'Gold',
  Aquamarine = 'Aquamarine',
  SkyBlue = 'SkyBlue',
  DeepPink = 'DeepPink',
  Coral = 'Coral',
  Lilac = 'Lilac',
}

export type VideoModule = {
  type: HomepageModuleType.VideoModule
  id: string
  title: string
  videoTitle: string
  videoThumbnail: string
  durationInMinutes: number
  youtubeVideoId: string
  offersModuleParameters: OffersModuleParameters[]
  color: Color
  videoTag: string
  offerTitle: string
  videoDescription: string
  videoPublicationDate: string
  offerIds?: string[]
  eanList?: string[]
}

export interface VideoModuleProps extends VideoModule {
  index: number
  homeEntryId: string
  shouldShowModal: boolean
  isMultiOffer: boolean
  analyticsParams: OfferAnalyticsParams
  showVideoModal: () => void
  hideVideoModal: () => void
  offers: Offer[]
}
export type HighlightOfferModule = {
  type: HomepageModuleType.HighlightOfferModule
  id: string
  highlightTitle: string
  offerTitle: string
  offerId?: string
  offerTag?: string
  offerEan?: string
  image: string
  color: Color
}

export type OffersPlaylistParameters = SearchQueryParameters[]

export type OfferModuleParamsInfo = {
  adaptedPlaylistParameters: OffersPlaylistParameters
  moduleId: string
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

export const isHighlightOfferModule = (module: HomepageModule): module is HighlightOfferModule => {
  return module.type === HomepageModuleType.HighlightOfferModule
}

export const isThematicHighlightModule = (
  module: HomepageModule
): module is ThematicHighlightModule => {
  return module.type === HomepageModuleType.ThematicHighlightModule
}

export const isCategoryListModule = (module: HomepageModule): module is CategoryListModule => {
  return module.type === HomepageModuleType.CategoryListModule
}

export const isVideoModule = (module: HomepageModule): module is VideoModule => {
  return module.type === HomepageModuleType.VideoModule
}
