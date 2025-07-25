import { Color } from 'features/home/types'
import { GtlLevel } from 'shared/gtl/types'

export enum ContentTypes {
  ALGOLIA = 'algolia',
  ALGOLIA_PARAMETERS = 'algoliaParameters',
  BOOK_TYPES = 'bookTypes',
  BUSINESS = 'business',
  CATEGORIES = 'categories',
  CATEGORY_BLOCK = 'categoryBlock',
  CATEGORY_LIST = 'categoryList',
  CLASSIC_THEMATIC_HEADER = 'classicThematicHeader',
  DISPLAY_PARAMETERS = 'displayParameters',
  EXCLUSIVITY = 'exclusivity',
  EXCLUSIVITY_DISPLAY_PARAMETERS = 'exclusivityDisplayParameters',
  GTL_PLAYLIST = 'gtlPlaylist',
  HIGHLIGHT_OFFER = 'highlightOffer',
  HOMEPAGE_NATIF = 'homepageNatif',
  HYBRID = 'hybrid',
  INFORMATION = 'information',
  MOVIE_GENRES = 'movieGenres',
  MUSIC_TYPES = 'musicTypes',
  RECOMMENDATION = 'recommendation',
  RECOMMENDATION_PARAMETERS = 'recommendation_parameters',
  SHOW_TYPES = 'showTypes',
  SUBCATEGORIES = 'subcategories',
  THEMATIC_CATEGORY_INFO = 'thematicCategoryInfo',
  THEMATIC_HIGHLIGHT = 'thematicHighlight',
  THEMATIC_HIGHLIGHT_INFO = 'thematic_highlight_info',
  TREND_BLOCK = 'trendBlock',
  TRENDS = 'trends',
  VENUE_MAP_BLOCK = 'venueMapBlock',
  VENUES_PARAMETERS = 'venuesParameters',
  VENUES_PLAYLIST = 'venuesPlaylist',
  VIDEO = 'video',
  VIDEO_CAROUSEL = 'videoCarousel',
  VIDEO_CAROUSEL_ITEM = 'videoCarouselItem',
}

export type Layout = 'three-items' | 'two-items' | 'one-item-medium'

interface Entry<T, ContentType extends ContentTypes> {
  sys: Sys<ContentType>
  // if the content model is unpublished/deleted, `fields` won't be provided
  fields?: T
}

type ProvidedEntry<T, ContentType extends ContentTypes> = {
  sys: Sys<ContentType>
  fields: T
}

interface EntryCollectionInclusions<T, ContentType extends ContentTypes> {
  string: Array<Asset<ContentType> | Entry<T, ContentType>>
}

export interface EntryCollection<T, ContentType extends ContentTypes>
  extends ContentfulCollection<Entry<T, ContentType>> {
  errors?: Array<EntryCollectionError>
  includes?: EntryCollectionInclusions<T, ContentType>
}

interface ContentfulCollection<T> {
  total: number
  skip: number
  limit: number
  items: Array<T>
}

interface Asset<ContentType extends ContentTypes> {
  sys: Sys<ContentType>
  fields: {
    title: string
    description: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: ContentType
    }
  }
}

interface Sys<ContentType extends ContentTypes> {
  type: string
  id: string
  createdAt: string
  updatedAt: string
  environment: { sys: { id: string; type: string; linkType: string } }
  locale: string
  revision?: number
  space?: {
    sys: SpaceLink
  }
  contentType?: {
    sys: {
      type: string
      linkType: string
      id: ContentType
    }
  }
}

interface SpaceLink {
  type: string
  linkType: string
  id: string
}

interface EntryCollectionError {
  sys: {
    id: string
    type: string
  }
  details: {
    type: string
    linkType: string
    id: string
  }
}

export type AlgoliaParameters = Entry<SearchParametersFields, ContentTypes.ALGOLIA_PARAMETERS>
export type ProvidedAlgoliaParameters = ProvidedEntry<
  SearchParametersFields,
  ContentTypes.ALGOLIA_PARAMETERS
>

export type VenuesParameters = Entry<VenuesParametersFields, ContentTypes.VENUES_PARAMETERS>
export type ProvidedVenuesParameters = ProvidedEntry<
  VenuesParametersFields,
  ContentTypes.VENUES_PARAMETERS
>

type DisplayParameters = Entry<DisplayParametersFields, ContentTypes.DISPLAY_PARAMETERS>

export type RecommendationParameters = Entry<
  RecommendationParametersFields,
  ContentTypes.RECOMMENDATION_PARAMETERS
>

export type Subcategories = Entry<SubcategoriesFields, ContentTypes.SUBCATEGORIES>

export type Categories = Entry<CategoriesFields, ContentTypes.CATEGORIES>

export type MovieGenres = Entry<MovieGenresFields, ContentTypes.MOVIE_GENRES>

export type MusicTypes = Entry<MusicTypesFields, ContentTypes.MUSIC_TYPES>

export type ShowTypes = Entry<ShowTypesFields, ContentTypes.SHOW_TYPES>

export type BookTypes = Entry<BookTypesFields, ContentTypes.BOOK_TYPES>

export type ThematicCategoryInfo = Entry<
  ThematicCategoryInfoFields,
  ContentTypes.THEMATIC_CATEGORY_INFO
>
type ProvidedThematicCategoryInfo = ProvidedEntry<
  ThematicCategoryInfoFields,
  ContentTypes.THEMATIC_CATEGORY_INFO
>

export type ThematicHighlightInfo = Entry<
  ThematicHighlightInfoFields,
  ContentTypes.THEMATIC_HIGHLIGHT_INFO
>

type ClassicThematicHeaderFields = {
  title: string
  displayedTitle: string
  displayedSubtitle?: string
}

export type ClassicThematicHeader = Entry<
  ClassicThematicHeaderFields,
  ContentTypes.CLASSIC_THEMATIC_HEADER
>

export type VideoContentModel = Entry<VideoFields, ContentTypes.VIDEO>

type VideoFields = {
  title: string
  displayedTitle: string
  videoTitle: string
  videoThumbnail: Image
  durationInMinutes: number
  youtubeVideoId: string
  algoliaParameters: AlgoliaParameters
  color: Color
  videoTag: string
  offerTitle: string
  videoDescription: string
  videoPublicationDate: string
  offerIds?: string[]
  eanList?: string[]
  additionalAlgoliaParameters?: AlgoliaParameters[]
}

type VenueMapBlockFields = {
  title: string
  homeEntryId?: string
}
export type VenueMapBlockContentModel = Entry<VenueMapBlockFields, ContentTypes.VENUE_MAP_BLOCK>

type Cover = Entry<CoverFields, ContentTypes.INFORMATION>

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/cover/fields
interface CoverFields {
  title: string
  image: Image
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algolia/fields
export interface AlgoliaFields {
  title: string
  algoliaParameters: AlgoliaParameters
  displayParameters: DisplayParameters
  cover?: Cover
  additionalAlgoliaParameters?: AlgoliaParameters[]
  recommendationParameters?: RecommendationParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/venuesPlaylist/fields
export interface VenuesFields {
  title: string
  venuesSearchParameters: VenuesParameters[]
  displayParameters: DisplayParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/recommendation/fields
export interface RecommendationFields {
  title: string
  displayParameters: DisplayParameters
  recommendationParameters?: RecommendationParameters
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algoliaParameters/fields
export interface SearchParametersFields {
  title: string
  algoliaSubcategories?: Subcategories
  algoliaCategories?: Categories
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
  movieGenres?: MovieGenres
  musicTypes?: MusicTypes
  showTypes?: ShowTypes
  bookTypes?: BookTypes
  gtlLevel?: GtlLevel
  gtlLabel?: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/venuesSearchParameters/fields
interface VenuesParametersFields {
  title: string
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
  isGeolocated?: boolean
  aroundRadius?: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/displayParameters/fields
export interface DisplayParametersFields {
  title: string
  layout: Layout
  minOffers: number
  subtitle?: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/business/fields
interface BusinessFields {
  title: string
  firstLine?: string
  secondLine?: string
  image: Image
  imageWeb?: Image
  url?: string
  targetNotConnectedUsersOnly?: boolean
  latitude?: number
  longitude?: number
  radius?: number
  date?: string
  callToAction?: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/recommendationSearchParameters/fields
export interface RecommendationParametersFields {
  title: string
  recommendationCategories?: Categories
  recommendationSubcategories?: Subcategories
  beginningDatetime?: string
  endingDatetime?: string
  upcomingWeekendEvent?: boolean
  eventDuringNextXDays?: number
  currentWeekEvent?: boolean
  newestOnly?: boolean
  isEvent?: boolean
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  isRecoShuffled?: boolean
  modelEndpoint?: string
  bookTypes?: BookTypes
  movieGenres?: MovieGenres
  musicTypes?: MusicTypes
  showTypes?: ShowTypes
}

type SubcategoriesFields = {
  subcategories: string[]
}
type CategoriesFields = {
  categories: ContentfulLabelCategories[]
}

type MovieGenresFields = {
  movieGenres: string[]
}
type ShowTypesFields = {
  showTypes: string[]
}

type MusicTypesFields = {
  musicTypes: string[]
}

type BookTypesFields = {
  bookTypes: string[]
}

type ThematicCategoryInfoFields = {
  title: string
  displayedTitle: string
  displayedSubtitle?: string
  image: Image
  color: Color
}

export type ThematicHighlightFields = {
  title: string
  thematicHighlightInfo: ThematicHighlightInfo
  thematicHomeEntryId: string
}

type ThematicHighlightInfoFields = {
  title: string
  displayedTitle: string
  displayedSubtitle?: string
  image: Image
  beginningDatetime: string
  endingDatetime: string
  introductionTitle?: string
  introductionParagraph?: string
}

interface CategoryListFields {
  title: string
  categoryBlockList: CategoryBlockContentModel[]
}

export type CategoryBlockContentModel = Entry<CategoryBlockFields, ContentTypes.CATEGORY_BLOCK>

export type ProvidedCategoryBlockContentModel = ProvidedEntry<
  CategoryBlockFields & { thematicCategoryInfo: ProvidedThematicCategoryInfo },
  ContentTypes.CATEGORY_BLOCK
>

interface CategoryBlockFields {
  title: string
  homeEntryId: string
  thematicCategoryInfo: ThematicCategoryInfo
}

type Image = Entry<
  {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  },
  ContentTypes.INFORMATION
>

// List available here https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/settings/tags
type TagId = 'master' | 'usergrandpublic' | 'userunderage'

interface Tag {
  sys: { type: 'Link'; linkType: 'Tag'; id: TagId }
}

type GtlPlaylistFields = {
  algoliaParameters: AlgoliaParameters
  displayParameters: DisplayParameters
}
export type GtlPlaylist = Entry<GtlPlaylistFields, ContentTypes.GTL_PLAYLIST>

export interface HomepageNatifEntry {
  metadata: { tags: Tag[] }
  sys: Sys<typeof ContentTypes.HOMEPAGE_NATIF>
  fields: HomepageNatifFields
}

type ThematicHeader = ThematicHighlightInfo | ThematicCategoryInfo | ClassicThematicHeader

interface HomepageNatifFields {
  title: string
  modules: HomepageNatifModule[]
  thematicHeader?: ThematicHeader
}

export type HomepageNatifModule =
  | AlgoliaContentModel
  | BusinessContentModel
  | RecommendationContentModel
  | ThematicHighlightContentModel
  | TrendBlockContentModel
  | TrendsContentModel
  | VenuesContentModel
  | VideoContentModel
  | CategoryListContentModel
  | HighlightOfferContentModel
  | VenueMapBlockContentModel
  | VideoCarouselContentModel

export type AlgoliaContentModel = Entry<AlgoliaFields, ContentTypes.ALGOLIA>

export type BusinessContentModel = Entry<BusinessFields, ContentTypes.BUSINESS>

export type RecommendationContentModel = Entry<RecommendationFields, ContentTypes.RECOMMENDATION>

export type ThematicHighlightContentModel = Entry<
  ThematicHighlightFields,
  ContentTypes.THEMATIC_HIGHLIGHT
>

export type VenuesContentModel = Entry<VenuesFields, ContentTypes.VENUES_PLAYLIST>

export type CategoryListContentModel = Entry<CategoryListFields, ContentTypes.CATEGORY_LIST>

export type HighlightOfferContentModel = Entry<HighlightOfferFields, ContentTypes.HIGHLIGHT_OFFER>

export type VideoCarouselContentModel = Entry<VideoCarouselFields, ContentTypes.VIDEO_CAROUSEL>

export type VideoCarouselItemContentModel = ProvidedEntry<
  VideoCarouselItemFields,
  ContentTypes.VIDEO_CAROUSEL_ITEM
>

type VideoCarouselItemFields = {
  title: string
  youtubeVideoId: string
  offerId?: string
  tag?: string
  homeEntryId?: string
  thematicHomeTitle?: string
  thematicHomeTag?: string
  thematicHomeSubtitle?: string
}

type VideoCarouselFields = {
  title: string
  color: Color
  items: VideoCarouselItemContentModel[]
}

type HighlightOfferFields = {
  highlightTitle: string
  offerTitle: string
  offerImage: Image
  offerId?: string
  offerTag?: string
  offerEan?: string
  color: Color
  isGeolocated?: boolean
  aroundRadius?: number
  displayBookingAllowedDatetime?: boolean
}

export type TrendBlockFields = {
  title: string
  image: Image
  homeEntryId: string
}

export type TrendBlockContentModel = Entry<TrendBlockFields, ContentTypes.TREND_BLOCK>

type TrendsFields = {
  items: (TrendBlockContentModel | VenueMapBlockContentModel)[]
}

export type TrendsContentModel = Entry<TrendsFields, ContentTypes.TRENDS>

export const isAlgoliaContentModel = (module: HomepageNatifModule): module is AlgoliaContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.ALGOLIA

export const isBusinessContentModel = (
  module: HomepageNatifModule
): module is BusinessContentModel => module.sys.contentType?.sys.id === ContentTypes.BUSINESS

export const isRecommendationContentModel = (
  module: HomepageNatifModule
): module is RecommendationContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.RECOMMENDATION

export const isThematicHighlightContentModel = (
  module: HomepageNatifModule
): module is ThematicHighlightContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.THEMATIC_HIGHLIGHT

export const isVenuesContentModel = (module: HomepageNatifModule): module is VenuesContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.VENUES_PLAYLIST

export const isCategoryListContentModel = (
  module: HomepageNatifModule
): module is CategoryListContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.CATEGORY_LIST

export const isThematicHighlightInfo = (
  thematicHeader?: ThematicHeader
): thematicHeader is ThematicHighlightInfo =>
  thematicHeader?.sys.contentType?.sys.id === ContentTypes.THEMATIC_HIGHLIGHT_INFO

export const isThematicCategoryInfo = (
  thematicHeader?: ThematicHeader
): thematicHeader is ThematicCategoryInfo =>
  thematicHeader?.sys.contentType?.sys.id === ContentTypes.THEMATIC_CATEGORY_INFO

export const isTrendsContentModel = (module: HomepageNatifModule): module is TrendsContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.TRENDS

export const isClassicThematicHeader = (
  thematicHeader?: ThematicHeader
): thematicHeader is ClassicThematicHeader =>
  thematicHeader?.sys.contentType?.sys.id === ContentTypes.CLASSIC_THEMATIC_HEADER

export const isVenueMapBlockContentModel = (
  module: HomepageNatifModule
): module is VenueMapBlockContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.VENUE_MAP_BLOCK

export type ContentfulLabelCategories =
  | 'Arts & loisirs créatifs'
  | 'Cartes jeunes'
  | 'CD, vinyles, musique en ligne'
  | 'Cinéma'
  | 'Concerts & festivals'
  | 'Conférences & rencontres'
  | 'Évènements en ligne'
  | 'Films, documentaires et séries'
  | 'Instruments de musique'
  | 'Jeux & jeux vidéos'
  | 'Livres'
  | 'Médias & presse'
  | 'Musées & visites culturelles'
  | 'Musique'
  | 'Spectacles'

export const isVideoContentModel = (module: HomepageNatifModule): module is VideoContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.VIDEO

export const isHighlightOfferContentModel = (
  module: HomepageNatifModule
): module is HighlightOfferContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.HIGHLIGHT_OFFER

export const isVideoCarouselContentModel = (
  module: HomepageNatifModule
): module is VideoCarouselContentModel =>
  module.sys.contentType?.sys.id === ContentTypes.VIDEO_CAROUSEL
