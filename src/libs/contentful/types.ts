export enum ContentTypes {
  ALGOLIA = 'algolia',
  ALGOLIA_PARAMETERS = 'algoliaParameters',
  BOOK_TYPES = 'bookTypes',
  DISPLAY_PARAMETERS = 'displayParameters',
  EXCLUSIVITY = 'exclusivity',
  EXCLUSIVITY_DISPLAY_PARAMETERS = 'exclusivityDisplayParameters',
  HOMEPAGE_NATIF = 'homepageNatif',
  INFORMATION = 'information',
  BUSINESS = 'business',
  RECOMMENDATION = 'recommendation',
  RECOMMENDATION_PARAMETERS = 'recommendation_parameters',
  SUBCATEGORIES = 'subcategories',
  CATEGORIES = 'categories',
  THEMATIC_CATEGORY_INFO = 'thematicCategoryInfo',
  THEMATIC_HIGHLIGHT = 'thematicHighlight',
  THEMATIC_HIGHLIGHT_INFO = 'thematic_highlight_info',
  VENUES_PLAYLIST = 'venuesPlaylist',
  VENUES_PARAMETERS = 'venuesParameters',
  CATEGORY_BLOCK = 'categoryBlock',
  CATEGORY_LIST = 'categoryList',
  MOVIE_GENRES = 'movieGenres',
  MUSIC_TYPES = 'musicTypes',
  SHOW_TYPES = 'showTypes',
  VIDEO = 'video',
}

export type Layout = 'two-items' | 'one-item-medium'

export interface Entry<T, ContentType extends ContentTypes> {
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

export interface Sys<ContentType extends ContentTypes> {
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

export type DisplayParameters = Entry<DisplayParametersFields, ContentTypes.DISPLAY_PARAMETERS>

export type ExcluDisplayParameters = Entry<
  ExclusivityDisplayParametersFields,
  ContentTypes.EXCLUSIVITY_DISPLAY_PARAMETERS
>

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
export type ProvidedThematicCategoryInfo = ProvidedEntry<
  ThematicCategoryInfoFields,
  ContentTypes.THEMATIC_CATEGORY_INFO
>

export type ThematicHighlightInfo = Entry<
  ThematicHighlightInfoFields,
  ContentTypes.THEMATIC_HIGHLIGHT_INFO
>

export type ThematicHighlightParameters = Entry<
  ThematicHighlightFields,
  ContentTypes.THEMATIC_HIGHLIGHT
>

type Color = 'Gold' | 'Aquamarine' | 'SkyBlue' | 'DeepPink' | 'Coral' | 'Lilac'

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
}

export type Cover = Entry<CoverFields, ContentTypes.INFORMATION>

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
  isGeolocated?: boolean
  aroundRadius?: number
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
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/content_types/venuesSearchParameters/fields
export interface VenuesParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  venueTypes?: string[]
  tags?: string[]
  hitsPerPage: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/displayParameters/fields
export interface DisplayParametersFields {
  title: string
  layout: Layout
  minOffers: number
  subtitle?: string
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/exclusivityDisplayParameters/fields
export interface ExclusivityDisplayParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/business/fields
export interface BusinessFields {
  title: string
  firstLine?: string
  secondLine?: string
  leftIcon?: Image
  image: Image
  url?: string
  targetNotConnectedUsersOnly?: boolean
}

// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/exclusivity/fields
export interface ExclusivityFields {
  title: string
  alt: string
  image: Image
  offerId: string
  displayParameters?: ExcluDisplayParameters
  url?: string
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
  categories: string[]
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

export type ThematicCategoryInfoFields = {
  title: string
  displayedTitle: string
  displayedSubtitle?: string
  image: Image
}

export type ThematicHighlightFields = {
  title: string
  thematicHighlightInfo: ThematicHighlightInfo
  thematicHomeEntryId: string
}

export type ThematicHighlightInfoFields = {
  title: string
  displayedTitle: string
  displayedSubtitle?: string
  image: Image
  beginningDatetime: string
  endingDatetime: string
  introductionTitle?: string
  introductionParagraph?: string
}

export interface CategoryListFields {
  title: string
  categoryBlockList: CategoryBlockContentModel[]
}

export type CategoryBlockContentModel = Entry<CategoryBlockFields, ContentTypes.CATEGORY_BLOCK>
export type ProvidedCategoryBlockContentModel = ProvidedEntry<
  CategoryBlockFields & { thematicCategoryInfo: ProvidedThematicCategoryInfo },
  ContentTypes.CATEGORY_BLOCK
>

export interface CategoryBlockFields {
  title: string
  homeEntryId: string
  thematicCategoryInfo: ThematicCategoryInfo
}

export type Image = Entry<
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
export type TagId = 'master' | 'usergrandpublic' | 'userunderage'

export interface Tag {
  sys: { type: 'Link'; linkType: 'Tag'; id: TagId }
}

export interface HomepageNatifEntry {
  metadata: { tags: Tag[] }
  sys: Sys<typeof ContentTypes.HOMEPAGE_NATIF>
  fields: HomepageNatifFields
}

export type ThematicHeader = ThematicHighlightInfo | ThematicCategoryInfo

interface HomepageNatifFields {
  title: string
  modules: HomepageNatifModule[]
  thematicHeaderTitle?: string
  thematicHeaderSubtitle?: string
  thematicHeader?: ThematicHeader
}

export type HomepageNatifModule =
  | AlgoliaContentModel
  | BusinessContentModel
  | ExclusivityContentModel
  | RecommendationContentModel
  | ThematicHighlightContentModel
  | VenuesContentModel
  | VideoContentModel
  | CategoryListContentModel

export type AlgoliaContentModel = Entry<AlgoliaFields, ContentTypes.ALGOLIA>

export type BusinessContentModel = Entry<BusinessFields, ContentTypes.BUSINESS>

export type ExclusivityContentModel = Entry<ExclusivityFields, ContentTypes.EXCLUSIVITY>

export type RecommendationContentModel = Entry<RecommendationFields, ContentTypes.RECOMMENDATION>

export type ThematicHighlightContentModel = Entry<
  ThematicHighlightFields,
  ContentTypes.THEMATIC_HIGHLIGHT
>

export type VenuesContentModel = Entry<VenuesFields, ContentTypes.VENUES_PLAYLIST>

export type CategoryListContentModel = Entry<CategoryListFields, ContentTypes.CATEGORY_LIST>

export const isAlgoliaContentModel = (
  module: HomepageNatifModule
): module is AlgoliaContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.ALGOLIA
}

export const isBusinessContentModel = (
  module: HomepageNatifModule
): module is BusinessContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.BUSINESS
}

export const isExclusivityContentModel = (
  module: HomepageNatifModule
): module is ExclusivityContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.EXCLUSIVITY
}

export const isRecommendationContentModel = (
  module: HomepageNatifModule
): module is RecommendationContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.RECOMMENDATION
}

export const isThematicHighlightContentModel = (
  module: HomepageNatifModule
): module is ThematicHighlightContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.THEMATIC_HIGHLIGHT
}

export const isVenuesContentModel = (module: HomepageNatifModule): module is VenuesContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.VENUES_PLAYLIST
}

export const isCategoryListContentModel = (
  module: HomepageNatifModule
): module is CategoryListContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.CATEGORY_LIST
}

export const isThematicHighlightInfo = (
  thematicHeader?: ThematicHeader
): thematicHeader is ThematicHighlightInfo => {
  return thematicHeader?.sys.contentType?.sys.id === ContentTypes.THEMATIC_HIGHLIGHT_INFO
}

export const isThematicCategoryInfo = (
  thematicHeader?: ThematicHeader
): thematicHeader is ThematicCategoryInfo => {
  return thematicHeader?.sys.contentType?.sys.id === ContentTypes.THEMATIC_CATEGORY_INFO
}

export const isVideoContentModel = (module: HomepageNatifModule): module is VideoContentModel => {
  return module.sys.contentType?.sys.id === ContentTypes.VIDEO
}
