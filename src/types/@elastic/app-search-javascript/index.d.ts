interface CreateClientOptions {
  /** Your Host Identifier, should start with host-. Required unless explicitly setting endpointBase */
  hostIdentifier?: string
  accountHostKey?: string
  apiKey?: string

  /** Your Public Search Key. It should start with search-.$
   *
   * NOTE: This is not technically required, but in 99% of cases it should be provided.
   * There is a small edge case for not providing this, mainly useful for internal App Search usage,
   * where this can be ommited in order to leverage App Search's session based authentication.
   */
  searchKey: string
  engineName: string

  /**
   * Overrides the base of the App Search API endpoint completely. Useful when proxying the App Search API,
   * developing against a local server, or a Self-Managed or Cloud Deployment. Ex. "http://localhost:3002"
   */
  endpointBase?: string

  /** Whether or not API responses should be cached. Default: true. */
  cacheResponses?: string

  /** An Object with keys and values that will be converted to header names and values on all API requests */
  additionalHeaders?: string
}

/** The base unit of measurement: mm, cm, m (meters), km, in, ft, yd, or mi (miles). */
export type GeoUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi'
export type BooleanQueryType = 'all' | 'any' | 'none'

/** Return documents that contain a specific field value.
 * Available on text, number, and date fields.
 * Supports arrays.
 *
 * https://swiftype.com/documentation/app-search/api/search/filters#value-filters
 */
export type ValueFilter = string | string[] | number | number[]

/** Return documents over a range of dates or numbers.
 * Available on number or date fields.
 *
 * https://swiftype.com/documentation/app-search/api/search/filters#range-filters
 */
export interface RangeFilter {
  /** Exclusive upper bound of the range. Is required if from is not given. */
  from?: string | number
  /** Inclusive lower bound of the range. Is required if to is not given. */
  to?: string | number
}

/** Return documents relative to their location.
 *
 * https://swiftype.com/documentation/app-search/api/search/filters#geo-filters
 */
export interface GeoFilter {
  /** The mode of the distribution as a string in "[latitude], [longitude]" format. */
  center: string
  unit: GeoUnit
  /** A number representing the distance unit. Is required if from or to is not given. */
  distance: number
}

type Filter<Enum> = Enum extends string
  ? Partial<Record<Enum, RangeFilter | GeoFilter | ValueFilter>>
  : never

export type FilterArray<FieldsEnum> = Array<
  Filter<FieldsEnum> | Partial<Record<Pick<BooleanQueryType>, Array<Filter<FieldsEnum>>>>
>

export type Filters<FieldsEnum> =
  | Record<Pick<BooleanQueryType>, Filter<FieldsEnum> | FilterArray<FieldsEnum>>
  | Filter<FieldsEnum>
  | FilterArray<FieldsEnum>

/** The search_fields parameter restricts a query to search only specific fields.
 * Restricting fields will result in faster queries, especially for schemas with many text fields.
 * Only available within text fields.
 *
 * https://swiftype.com/documentation/app-search/api/search/search-fields
 */
export type SearchFields<FieldsEnum> = FieldsEnum extends string
  ? Partial<Record<FieldsEnum, { weight?: number }>>
  : never

interface ResultFieldRaw {
  /** Length of the return value. Only can be used on text fields. Must be at least 20; defaults to the entire text field. If given for a different field type other than text, it will be silently ignored */
  size?: number
}

interface ResultFieldSnippet {
  /** Character length of the snippet returned. Must be at least 20; defaults to 100. */
  size?: number
  /** If true, return the raw text field if no snippet is found. If false, only use snippets. */
  fallback?: boolean
}

/** Change the fields which appear in search results and how their values are rendered.
 * Select from two ways to render text field values:
 * - Raw: An exact representation of the value within a field. And it is exact! It is not HTML escaped.
 * - Snippet: A snippet is an HTML escaped representation of the value within a field,
 * where query matches are captured in <em> tags.
 *
 * https://swiftype.com/documentation/app-search/api/search/result-fields
 */
export type ResultFields<FieldsEnum> = FieldsEnum extends string
  ? Partial<Record<FieldsEnum, { raw?: ResultFieldRaw; snippet?: ResultFieldSnippet }>>
  : never

/** Allows for the adjustments to pagination.
 *
 * https://swiftype.com/documentation/app-search/api/search#paging
 */
interface Page {
  /** Number of results per page. Must be between 1 and 100; defaults to 20 */
  size: number
  /** Page number to return. Must be greater or equal to 1; defaults to 1. */
  current: number
}

type SortOption<FieldsEnum> = FieldsEnum extends string
  ? Partial<Record<FieldsEnum | '_score', 'asc' | 'desc'>>
  : never

export type Sort<FieldsEnum> = SortOption<FieldsEnum> | Array<SortOption<FieldsEnum>>

/** A Value Boost will boost the score of a document based on a direct value match.
 * Available on text, number, and date fields.
 * A document's overall score will only be boosted once.
 *
 * https://swiftype.com/documentation/app-search/api/search/boosts#value-boosts
 */
interface ValueBoost {
  type: 'value'
  /** The value to exact match on. Use an array to match on multiple values. */
  value: number | string
  /** The arithmetic operation used to combine the original document score with your boost value. Defaults to add. */
  operation?: 'add' | 'multiply'
  /** Factor to alter the impact of a boost on the score of a document. Must be between -10 and 10. Defaults to 1.0 */
  factor?: number
}

/** A functional boost will apply a function to the overall document score.
 * Only available on number fields.
 *
 * https://swiftype.com/documentation/app-search/api/search/boosts#functional-boosts
 */
interface FunctionalBoost {
  type: 'functional'
  /** Type of function to calculate the boost value */
  function: 'linear' | 'exponential' | 'logarithmic'
  /** The arithmetic operation used to combine the original document score with your boost value. Defaults to add. */
  operation?: 'add' | 'multiply'
  /** Factor to alter the impact of a boost on the score of a document. Must be between -10 and 10. Defaults to 1.0 */
  factor?: number
}

/** Boost on the difference of a document value and a given value from the center parameter.
 * Available on number and geolocation fields.
 *
 * https://swiftype.com/documentation/app-search/api/search/boosts#proximity-boosts
 */
export interface ProximityBoost {
  type: 'proximity'
  /** The mode of the distribution */
  center: string
  /** Type of function to calculate the boost value */
  function: 'linear' | 'exponential' | 'gaussian'
  /** Factor to alter the impact of a boost on the score of a document. Must be between -10 and 10. Defaults to 1.0 */
  factor?: number
}

/** Boosts affect the score of the entire document.
 * Provide a field to boost, then increase or decrease document relevance based on values.
 *
 * https://swiftype.com/documentation/app-search/api/search/boosts
 */
export type Boosts<FieldsEnum> = FieldsEnum extends string
  ? Partial<Record<FieldsEnum, ValueBoost | FunctionalBoost | ProximityBoost>>
  : never

export interface SearchOptions<FieldsEnum> {
  search_fields?: SearchFields<FieldsEnum>
  result_fields?: ResultFields<FieldsEnum>
  filters?: Filters<FieldsEnum>
  group?: { field: FieldsEnum }
  page?: Page
  sort?: Sort<FieldsEnum>
  boosts?: Boosts<FieldsEnum>
}

export interface Info {
  meta: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alerts: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warnings: any[]
    precision: number
    page: { current: number; total_pages: number; total_results: number; size: number }
    engine: { name: string; type: string }
  }
}

export interface ResultItem<FieldsEnum> {
  /** Returns the HTML-unsafe raw value for a field, if it exists */
  getRaw: (fieldName: FieldsEnum) => string | string[]
  /** Returns the HTML-safe snippet value for a field, if it exists */
  getSnippet: (fieldName: FieldsEnum) => string
}

/** The search method returns the response wrapped in a ResultList type:
 *
 * https://github.com/elastic/app-search-javascript#searching
 */
export interface ResultList<FieldsEnum> {
  /** List of raw `results` from JSON response */
  rawResults: Array<ResultItem<FieldsEnum>>
  /** Object wrapping the raw `meta` property from JSON response */
  rawInfo: Info
  /** List of `results` wrapped in `ResultItem` type */
  results: Array<ResultItem<FieldsEnum>>
  /** Currently the same as `rawInfo` */
  info: Info
}

interface AppSearchClient {
  /** https://github.com/elastic/app-search-javascript#searching */
  search: <Field>(query: string, searchOptions: SearchOptions<Field>) => Promise<ResultList<Field>>

  /** https://github.com/elastic/app-search-javascript#multi-search */
  multiSearch: <Field>(
    multiSearchOptions: Array<{ query: string; options: SearchOptions<Field> }>
  ) => Promise<Array<ResultList<Field>>>
}

/**
 *
 * https://github.com/elastic/app-search-javascript#setup-configuring-the-client-and-authentication
 *
 * @param options See CreateClientOptions
 */
export function createClient(options: CreateClientOptions): AppSearchClient
