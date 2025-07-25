import { SearchOptions } from '@algolia/client-search'
import { Hit } from 'instantsearch.js'

import {
  GenreType,
  GenreTypeContentModel,
  GTL,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
  SubcategoryIdEnumv2,
  VenueResponse,
} from 'api/gen'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { Artist, Venue } from 'features/venue/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { Range } from 'libs/typesUtils/typeHelpers'
import { GtlLevel } from 'shared/gtl/types'

export type HitOffer = {
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  isEducational?: boolean
  name?: string
  prices?: number[]
  subcategoryId: SubcategoryIdEnum
  thumbUrl?: string
  searchGroupName?: SearchGroupNameEnumv2
  releaseDate?: number | string
  bookFormat?: string | null
  artist?: string
  ean?: string
  bookingAllowedDatetime?: string | null
  likes?: number
  chroniclesCount?: number
  headlineCount?: number
  tags?: string[]
}

export type AlgoliaOfferWithArtistAndEan = AlgoliaOffer<
  HitOffer & {
    artist: NonNullable<HitOffer['artist']>
    ean: NonNullable<HitOffer['ean']>
  }
>

export interface AlgoliaGeoloc {
  lat?: number | null
  lng?: number | null
}

export interface AlgoliaOffer<T = HitOffer> {
  offer: T
  _geoloc: Geoloc
  objectID: string
  venue: {
    departmentCode?: string
    id?: number
    name?: string
    publicName?: string
    address?: string
    postalCode?: string
    city?: string
  }
  artists?: Artist[]
  _tags?: string[]
}

interface AlgoliaFacetsAnalyticsKey {
  attribute?: string
  operator?: string
  count: number
}

interface AlgoliaFacetsAnalyticsNativeCategory extends AlgoliaFacetsAnalyticsKey {
  value: NativeCategoryIdEnumv2
}

interface AlgoliaFacetsAnalyticsCategory extends AlgoliaFacetsAnalyticsKey {
  value: SearchGroupNameEnumv2
}

interface AlgoliaFacetsObject {
  ['offer.nativeCategoryId']: AlgoliaFacetsAnalyticsNativeCategory[]
  ['offer.searchGroupNamev2']: AlgoliaFacetsAnalyticsCategory[]
}

interface AlgoliaFacets {
  analytics: AlgoliaFacetsObject
  exact_matches: AlgoliaFacetsObject
}

interface AlgoliaIndexInfos {
  exact_nb_hits: number
  facets: AlgoliaFacets
}

export type AlgoliaSuggestionHit = Hit<{
  // @ts-expect-error: this error is was hidden in a .d.ts file for a while and didn't cause any problem for years
  query: string
  [key: string]: AlgoliaIndexInfos
}>

interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: string
}

export enum LocationMode {
  AROUND_ME = 'AROUND_ME',
  EVERYWHERE = 'EVERYWHERE',
  AROUND_PLACE = 'AROUND_PLACE',
}

type OfferGenreType = { key: GenreType } & GenreTypeContentModel

/**
 * See Algolia doc on numericFilters and facetFilters
 *
 * [['A', 'B'], 'C'] <=> (A OR B) AND C
 */
export type FiltersArray = string[][]

export type SearchQueryParameters = {
  allocineId?: number
  beginningDatetime?: string
  date: SelectedDate | null
  eanList?: string[]
  artistName?: string
  endingDatetime?: string
  hitsPerPage: number | null
  isFullyDigitalOffersCategory?: boolean
  maxPossiblePrice?: string
  maxPrice?: string
  minBookingsThreshold?: number
  minPrice?: string
  isHeadline?: boolean
  offerCategories: SearchGroupNameEnumv2[]
  offerGenreTypes?: OfferGenreType[]
  offerGtlLabel?: string
  offerGtlLevel?: GtlLevel
  offerIsDuo: boolean
  offerIsFree?: boolean
  offerNativeCategories?: NativeCategoryIdEnumv2[] | BooksNativeCategoriesEnum[]
  offerSubcategories: SubcategoryIdEnumv2[]
  isDigital: boolean
  page?: number
  priceRange: Range<number> | null
  query: string
  searchId?: string
  tags: string[]
  timeRange: Range<number> | null
  venue?: Venue
  gtls?: GTL[]
  distinct?: boolean
  objectIds?: string[]
}

export type Geoloc = AlgoliaGeoloc

export type VenueHit = Pick<
  VenueResponse,
  | 'accessibility'
  | 'bannerUrl'
  | 'contact'
  | 'description'
  | 'id'
  | 'latitude'
  | 'longitude'
  | 'name'
  | 'publicName'
  | 'city'
  | 'postalCode'
  | 'isOpenToPublic'
> & {
  venueTypeCode: VenueTypeCode
}

export interface AlgoliaQueryParameters {
  query: string
  requestOptions?: SearchOptions
}

export interface FetchVenuesParameters {
  query: string
  attributesToHighlight?: string[]
  buildLocationParameterParams: BuildLocationParameterParams
  options?: SearchOptions
}
export interface OfferModuleQuery {
  indexName: string
  query: string
  params: {
    attributesToHighlight: never[]
    attributesToRetrieve: string[]
    filters?: string
    aroundLatLng?: string
    aroundRadius?: number | 'all'
    numericFilters?: FiltersArray
    facetFilters?: FiltersArray
    hitsPerPage?: number
  }
}

interface HighlightResult {
  fullyHighlighted: boolean
  matchLevel: string
  matchedWords: string[]
  value: string
}

interface AlgoliaVenueHighlightResult {
  name: HighlightResult
}

export interface AlgoliaVenue {
  objectID: string
  city: string
  postalCode: string | null
  name: string
  offerer_name: string
  venue_type: VenueTypeCode | null
  description: string
  audio_disability: boolean | null
  mental_disability: boolean | null
  motor_disability: boolean | null
  visual_disability: boolean | null
  email: string | null
  phone_number: string | null
  website: string | null
  facebook: string | null
  twitter: string | null
  instagram: string | null
  snapchat: string | null
  banner_url: string | null
  isPermanent: boolean | null
  isOpenToPublic: boolean
  _geoloc: Geoloc
  _highlightResult?: AlgoliaVenueHighlightResult
}

type FacetKeys =
  | FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE
  | FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES
  | FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE
  | FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY
  | FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE

type NativeCategoryFacets = Record<NativeCategoryIdEnumv2, number>
type GenreTypeFacets = Record<GenreType, number>

export type NativeCategoryFacetData = Record<
  FACETS_FILTERS_ENUM.OFFER_NATIVE_CATEGORY,
  NativeCategoryFacets
>

type GenreTypeFacetData = Record<FacetKeys, GenreTypeFacets>

export type FacetData = NativeCategoryFacetData | GenreTypeFacetData

export type MultipleOffersResult = {
  hits: AlgoliaOffer[]
  nbHits: number
}[]

export type PlaylistOffersParams = {
  offerParams: SearchQueryParameters
  locationParams: BuildLocationParameterParams
  indexName?: string
}

export type fetchOffersByGTLArgs = {
  parameters: PlaylistOffersParams[]
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  searchIndex?: string
}
