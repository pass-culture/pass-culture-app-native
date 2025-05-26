import { Animated } from 'react-native'

import { VenueAccessibilityModel, VenueContactModel } from 'api/gen'
import { PlaylistOffersParams, VenueHit } from 'libs/algolia/types'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentfulLabelCategories, ContentTypes, Layout } from 'libs/contentful/types'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { GtlLevel } from 'shared/gtl/types'
import { Offer } from 'shared/offer/types'

export enum HomepageModuleType {
  'OffersModule' = 'OffersModule',
  'VenuesModule' = 'VenuesModule',
  'BusinessModule' = 'BusinessModule',
  'RecommendedOffersModule' = 'RecommendedOffersModule',
  'ThematicHighlightModule' = 'ThematicHighlightModule',
  'TrendsModule' = 'TrendsModule',
  'CategoryListModule' = 'CategoryListModule',
  'VideoModule' = 'VideoModule',
  'HighlightOfferModule' = 'HighlightOfferModule',
  'VenueMapModule' = 'VenueMapModule',
  'VideoCarouselModule' = 'VideoCarouselModule',
}

export type HomepageTag = 'master' | 'usergrandpublic' | 'userunderage'

export enum ThematicHeaderType {
  'Default' = 'Default',
  'Highlight' = 'Highlight',
  'Category' = 'Category',
}

export type DefaultThematicHeader = {
  type: ThematicHeaderType.Default
  title: string
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
  gradientTranslation?: Animated.AnimatedInterpolation<string | number>
  imageAnimatedHeight?: Animated.AnimatedInterpolation<string | number>
}

export type CategoryThematicHeader = {
  type: ThematicHeaderType.Category
  title: string
  subtitle?: string
  imageUrl: string
  gradientTranslation?: Animated.AnimatedInterpolation<string | number>
  imageAnimatedHeight?: Animated.AnimatedInterpolation<string | number>
  color: Color
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
  | RecommendedOffersModule
  | ThematicHighlightModule
  | TrendsModule
  | VenuesModule
  | CategoryListModule
  | VideoModule
  | HighlightOfferModule
  | VideoCarouselModule

export type VideoCarouselModule = {
  type: HomepageModuleType.VideoCarouselModule
  id: string
  title: string
  color: Color
  items: VideoCarouselItem[]
}

export type VideoCarouselItem = {
  id: string
  title: string
  youtubeVideoId: string
  offerId?: string
  tag?: string
  homeEntryId?: string
  thematicHomeTitle?: string
  thematicHomeTag?: string
  thematicHomeSubtitle?: string
}

export type OffersModule = {
  type: HomepageModuleType.OffersModule
  id: string
  title: string
  offersModuleParameters: OffersModuleParameters[]
  displayParameters: DisplayParameters
  data?: ModuleData
  recommendationParameters?: RecommendedOffersParameters
}

type DisplayParameters = {
  title: string
  layout: Layout
  minOffers: number
  subtitle?: string
}

export type OffersModuleParameters = {
  title: string
  categories?: ContentfulLabelCategories[]
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
  isGeolocated?: boolean
  aroundRadius?: number
  gtlLevel?: GtlLevel
  gtlLabel?: string
}

export type BusinessModule = {
  type: HomepageModuleType.BusinessModule
  id: string
  analyticsTitle: string
  image: string
  imageWeb?: string
  title?: string
  subtitle?: string
  url?: string
  shouldTargetNotConnectedUsers?: boolean
  localizationArea?: LocationCircleArea
  date?: string
  callToAction?: string
}

export type LocationCircleArea = {
  latitude: number
  longitude: number
  radius: number
}

export type RecommendedOffersModule = {
  type: HomepageModuleType.RecommendedOffersModule
  id: string
  displayParameters: DisplayParameters
  recommendationParameters?: RecommendedOffersParameters
}

export type RecommendedOffersParameters = {
  categories?: ContentfulLabelCategories[]
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
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
  isGeolocated?: boolean
  aroundRadius?: number
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
  city: string
  postalCode: string | null
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
  color: Color
}

export type TrendBlock = {
  id: string
  title: string
} & (
  | { image: { uri: string }; homeEntryId: string; type: ContentTypes.TREND_BLOCK }
  | {
      image: { testUri: string }
      homeEntryId?: string
      type: ContentTypes.VENUE_MAP_BLOCK
    }
)

export type TrendsModule = {
  type: HomepageModuleType.TrendsModule
  id: string
  items: TrendBlock[]
}

export type TrendNavigationProps = {
  enableNavigate?: boolean // It is used by offline mode to prevent navigation
  navigateTo?: {
    screen?: 'VenueMap' | 'ThematicHome'
    params?: {
      homeId?: string
      moduleId?: string
      from?: string
    }
  }
  onBeforeNavigate?: VoidFunction
}

export enum Color {
  Gold = 'Gold',
  Aquamarine = 'Aquamarine',
  SkyBlue = 'SkyBlue',
  DeepPink = 'DeepPink',
  Coral = 'Coral',
  Lilac = 'Lilac',
  Decorative01 = 'Decorative01',
  Decorative02 = 'Decorative02',
  Decorative03 = 'Decorative03',
  Decorative04 = 'Decorative04',
  Decorative05 = 'Decorative05',
}

export type VenueMapModule = {
  type: HomepageModuleType.VenueMapModule
  id: string
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
  isGeolocated?: boolean
  aroundRadius?: number
  displayPublicationDate?: boolean
}

export type OffersPlaylistParameters = PlaylistOffersParams[]

export type OfferModuleParamsInfo = {
  adaptedPlaylistParameters: OffersPlaylistParameters
  moduleId: string
}

export const isVenuesModule = (module: HomepageModule): module is VenuesModule => {
  return module.type === HomepageModuleType.VenuesModule
}

export const isVideoCarouselModule = (module: HomepageModule): module is VideoCarouselModule => {
  return module.type === HomepageModuleType.VideoCarouselModule
}

export const isOffersModule = (module: HomepageModule): module is OffersModule => {
  return module.type === HomepageModuleType.OffersModule
}
