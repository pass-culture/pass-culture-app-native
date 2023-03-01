import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator/types'

type ScreensRequiringParsing = Extract<
  ScreenNames,
  | 'AfterChangeEmailValidationBuffer'
  | 'AfterSignupEmailValidationBuffer'
  | 'BookingDetails'
  | 'BookingConfirmation'
  | 'Home'
  | 'Login'
  | 'Offer'
  | 'ReinitializePassword'
  | 'ResetPasswordExpiredLink'
  | 'Venue'
  | 'Search'
  | 'SearchFilter'
  | 'LocationFilter'
  | 'ThematicHome'
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
  isOnline: JSON.parse,
  locationFilter: JSON.parse,
  maxPossiblePrice: JSON.parse,
  maxPrice: JSON.parse,
  minPrice: JSON.parse,
  noFocus: JSON.parse,
  offerCategories: JSON.parse,
  offerIsDuo: JSON.parse,
  offerIsFree: JSON.parse,
  offerIsNew: JSON.parse,
  offerGenreTypes: JSON.parse,
  offerNativeCategories: JSON.parse,
  offerSubcategories: JSON.parse,
  offerTypes: JSON.parse,
  previousView: JSON.parse,
  priceRange: JSON.parse,
  query: JSON.parse,
  searchId: JSON.parse,
  tags: JSON.parse,
  timeRange: JSON.parse,
  view: JSON.parse,
  minBookingsThreshold: JSON.parse,
}

export const screenParamsParser: ParamsParsers = {
  AfterChangeEmailValidationBuffer: {
    new_email: decodeURIComponent,
    token: identityFn,
    expiration_timestamp: Number,
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
  },

  Login: {
    preventCancellation: parseObject,
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
    openModalOnNavigation: identityFn,
    searchId: identityFn,
  },
  Home: {
    entryId: identityFn,
  },
  ReinitializePassword: {
    token: identityFn,
    email: decodeURIComponent,
    expiration_timestamp: Number,
  },
  ResetPasswordExpiredLink: {
    email: decodeURIComponent,
  },
  Venue: {
    id: (value) => (value ? Number(value) : 0),
  },
  Search: searchParamsParser,
  SearchFilter: searchParamsParser,
  LocationFilter: {
    selectedVenue: JSON.parse,
    selectedPlace: JSON.parse,
  },
  ThematicHome: {
    homeId: identityFn,
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
  'Search' | 'SearchFilter' | 'LocationFilter'
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
  isOnline: JSON.stringify,
  locationFilter: JSON.stringify,
  maxPossiblePrice: JSON.stringify,
  maxPrice: JSON.stringify,
  minPrice: JSON.stringify,
  noFocus: JSON.stringify,
  offerCategories: JSON.stringify,
  offerGenreTypes: JSON.stringify,
  offerIsDuo: JSON.stringify,
  offerIsFree: JSON.stringify,
  offerIsNew: JSON.stringify,
  offerNativeCategories: JSON.stringify,
  offerSubcategories: JSON.stringify,
  offerTypes: JSON.stringify,
  previousView: JSON.stringify,
  priceRange: JSON.stringify,
  query: JSON.stringify,
  searchId: JSON.stringify,
  tags: JSON.stringify,
  timeRange: JSON.stringify,
  view: JSON.stringify,
  minBookingsThreshold: JSON.stringify,
}

export const screenParamsStringifier: ParamsStringifiers = {
  Search: searchParamsStringifier,
  SearchFilter: searchParamsStringifier,
  LocationFilter: {
    selectedVenue: JSON.stringify,
    selectedPlace: JSON.stringify,
  },
}
