import { SearchOptions } from '@algolia/client-search'

import {
  GenreType,
  GenreTypeContentModel,
  GTL,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
  VenueResponse,
} from 'api/gen'
import { GTLLevel } from 'features/gtlPlaylist/types'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc, HighlightResult } from 'libs/algolia/algolia.d'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { Range } from 'libs/typesUtils/typeHelpers'

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
  beginningDatetime?: string
  date: SelectedDate | null
  endingDatetime?: string
  hitsPerPage: number | null
  isFullyDigitalOffersCategory?: boolean
  maxPossiblePrice?: string
  maxPrice?: string
  minBookingsThreshold?: number
  minPrice?: string
  offerCategories: SearchGroupNameEnumv2[]
  offerGenreTypes?: OfferGenreType[]
  offerGtlLabel?: string
  offerGtlLevel?: GTLLevel
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
}

export const transformHit = transformOfferHit

// An incomplete search hit may not have a subcategoryId (for retrocompatibility)
export type IncompleteSearchHit = AlgoliaHit

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
