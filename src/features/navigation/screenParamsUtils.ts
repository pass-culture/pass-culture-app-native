import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator/types'

type ScreensRequiringParsing = Extract<
  ScreenNames,
  | 'AccountSecurity'
  | 'AccountSecurityBuffer'
  | 'AfterSignupEmailValidationBuffer'
  | 'AISearch'
  | 'BookingDetails'
  | 'BookingConfirmation'
  | 'Chronicles'
  | 'Home'
  | 'Login'
  | 'Offer'
  | 'OfferPreview'
  | 'ReinitializePassword'
  | 'ResetPasswordExpiredLink'
  | 'Venue'
  | 'VenuePreviewCarousel'
  | 'SearchFilter'
  | 'SuspensionChoice'
  | 'LocationFilter'
  | 'ThematicHome'
  | 'SearchLanding'
  | 'SearchResults'
  | 'ThematicSearch'
>

type ParamsList = Required<AllNavParamList>

type ParamsParsers = {
  [Screen in ScreensRequiringParsing]: {
    [Param in keyof Required<RouteParams<ParamsList, Screen>>]: (
      value: string
    ) => RouteParams<ParamsList, Screen>[Param]
  }
}
const searchParamsParser = {
  beginningDatetime: parseDataWithISODates,
  date: parseDataWithISODates,
  endingDatetime: parseDataWithISODates,
  hitsPerPage: JSON.parse,
  isAutocomplete: JSON.parse,
  isFullyDigitalOffersCategory: JSON.parse,
  locationFilter: JSON.parse,
  maxPossiblePrice: JSON.parse,
  maxPrice: JSON.parse,
  minPrice: JSON.parse,
  offerCategories: JSON.parse,
  offerIsDuo: JSON.parse,
  offerIsFree: JSON.parse,
  offerGenreTypes: JSON.parse,
  offerNativeCategories: JSON.parse,
  offerSubcategories: JSON.parse,
  isDigital: JSON.parse,
  previousView: JSON.parse,
  priceRange: JSON.parse,
  query: JSON.parse,
  searchId: JSON.parse,
  tags: JSON.parse,
  timeRange: JSON.parse,
  view: JSON.parse,
  minBookingsThreshold: JSON.parse,
  isFromHistory: JSON.parse,
  venue: JSON.parse,
  accessibilityFilter: JSON.parse,
  gtls: JSON.parse,
  shouldRedirect: JSON.parse,
  defaultMinPrice: JSON.stringify,
  defaultMaxPrice: JSON.stringify,
}

export const screenParamsParser: ParamsParsers = {
  AccountSecurity: {
    token: identityFn,
    email: decodeURIComponent,
    reset_password_token: identityFn,
    reset_token_expiration_timestamp: Number,
  },
  AccountSecurityBuffer: {
    token: identityFn,
    email: decodeURIComponent,
    reset_password_token: identityFn,
    reset_token_expiration_timestamp: Number,
  },
  AfterSignupEmailValidationBuffer: {
    email: decodeURIComponent,
    token: identityFn,
    expiration_timestamp: Number,
  },
  BookingDetails: {
    id: Number,
  },
  BookingConfirmation: {
    offerId: Number,
    bookingId: Number,
    apiRecoParams: identityFn,
  },
  Chronicles: {
    offerId: Number,
    chronicleId: Number,
    from: identityFn,
  },
  Login: {
    displayForcedLoginHelpMessage: parseObject,
    offerId: identityFn,
    from: identityFn,
  },
  Offer: {
    id: Number,
    from: identityFn,
    moduleName: identityFn,
    moduleId: identityFn,
    fromOfferId: identityFn,
    fromMultivenueOfferId: identityFn,
    openModalOnNavigation: identityFn,
    searchId: identityFn,
    apiRecoParams: identityFn,
    playlistType: identityFn,
  },
  OfferPreview: {
    id: Number,
    defaultIndex: Number,
  },
  Home: {
    latitude: Number,
    longitude: Number,
    videoModuleId: identityFn,
  },
  ReinitializePassword: {
    token: identityFn,
    email: decodeURIComponent,
    expiration_timestamp: Number,
    from: identityFn,
  },
  ResetPasswordExpiredLink: {
    email: decodeURIComponent,
  },
  Venue: {
    id: (value) => (value ? Number(value) : 0),
    from: identityFn,
    searchId: identityFn,
    fromThematicSearch: identityFn,
  },
  VenuePreviewCarousel: {
    id: Number,
    defaultIndex: Number,
  },
  SearchResults: searchParamsParser,
  SearchLanding: searchParamsParser,
  ThematicSearch: searchParamsParser,
  AISearch: searchParamsParser,
  SearchFilter: searchParamsParser,
  LocationFilter: {
    selectedVenue: JSON.parse,
    selectedPlace: JSON.parse,
  },
  SuspensionChoice: {
    token: identityFn,
  },
  ThematicHome: {
    homeId: identityFn,
    videoModuleId: identityFn,
    from: identityFn,
    moduleId: identityFn,
    moduleListId: identityFn,
  },
}

// We allow to use `any` (instead of `string`) in order to support enum members
// like Referrals, ScreenNames, etc... Waiting for a better typing solution.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function identityFn(value: any) {
  return value
}

function parseObject(value?: string) {
  if (!value) return undefined
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

const DATE_ISO8601_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2,6}Z$/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDataWithISODates(data: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function reviver(_key: string, value: any) {
    return typeof value === 'string' && DATE_ISO8601_FORMAT.test(value) ? new Date(value) : value
  }

  return JSON.parse(typeof data === 'string' ? data : JSON.stringify(data), reviver)
}

type ScreensRequiringStringifying = Extract<
  ScreenNames,
  'SearchFilter' | 'LocationFilter' | 'SearchLanding' | 'SearchResults' | 'ThematicSearch'
>
type ParamsStringifiers = {
  [Screen in ScreensRequiringStringifying]: {
    [Param in keyof Required<RouteParams<ParamsList, Screen>>]: (
      value: RouteParams<ParamsList, Screen>[Param]
    ) => string
  }
}

const searchParamsStringifier = {
  beginningDatetime: JSON.stringify,
  date: JSON.stringify,
  endingDatetime: JSON.stringify,
  hitsPerPage: JSON.stringify,
  isAutocomplete: JSON.stringify,
  isFullyDigitalOffersCategory: JSON.stringify,
  locationFilter: JSON.stringify,
  maxPossiblePrice: JSON.stringify,
  maxPrice: JSON.stringify,
  minPrice: JSON.stringify,
  offerCategories: JSON.stringify,
  offerGenreTypes: JSON.stringify,
  offerIsDuo: JSON.stringify,
  offerIsFree: JSON.stringify,
  offerNativeCategories: JSON.stringify,
  offerSubcategories: JSON.stringify,
  isDigital: JSON.stringify,
  previousView: JSON.stringify,
  priceRange: JSON.stringify,
  query: JSON.stringify,
  searchId: JSON.stringify,
  tags: JSON.stringify,
  timeRange: JSON.stringify,
  view: JSON.stringify,
  minBookingsThreshold: JSON.stringify,
  isFromHistory: JSON.stringify,
  venue: JSON.stringify,
  accessibilityFilter: JSON.stringify,
  gtls: JSON.stringify,
  shouldRedirect: JSON.stringify,
  defaultMinPrice: JSON.stringify,
  defaultMaxPrice: JSON.stringify,
}

export const screenParamsStringifier: ParamsStringifiers = {
  SearchFilter: searchParamsStringifier,
  SearchLanding: searchParamsStringifier,
  SearchResults: searchParamsStringifier,
  ThematicSearch: searchParamsStringifier,
  LocationFilter: {
    selectedVenue: JSON.stringify,
    selectedPlace: JSON.stringify,
  },
}
