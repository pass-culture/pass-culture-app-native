import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator'

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
  | 'LocationFilter'
>

type ParamsList = Required<AllNavParamList>

type ParamsParsers = {
  [Screen in ScreensRequiringParsing]: {
    [Param in keyof Required<RouteParams<ParamsList, Screen>>]: (
      value: string
    ) => RouteParams<ParamsList, Screen>[Param]
  }
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
  },
  Offer: {
    id: Number,
    from: identityFn,
    moduleName: identityFn,
    moduleId: identityFn,
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
  Search: {
    beginningDatetime: parseDataWithISODates,
    date: parseDataWithISODates,
    endingDatetime: parseDataWithISODates,
    hitsPerPage: JSON.parse,
    locationFilter: JSON.parse,
    offerCategories: JSON.parse,
    offerSubcategories: JSON.parse,
    offerIsDuo: JSON.parse,
    offerIsFree: JSON.parse,
    offerIsNew: JSON.parse,
    offerTypes: JSON.parse,
    priceRange: JSON.parse,
    query: JSON.parse,
    tags: JSON.parse,
    timeRange: JSON.parse,
    view: JSON.parse,
    noFocus: JSON.parse,
    previousView: JSON.parse,
  },
  LocationFilter: {
    selectedVenue: JSON.parse,
    selectedPlace: JSON.parse,
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

type ScreensRequiringStringifying = Extract<ScreenNames, 'Search' | 'LocationFilter'>
type ParamsStringifiers = {
  [Screen in ScreensRequiringStringifying]: {
    [Param in keyof Required<RouteParams<ParamsList, Screen>>]: (
      value: RouteParams<ParamsList, Screen>[Param]
    ) => string
  }
}

export const screenParamsStringifier: ParamsStringifiers = {
  Search: {
    beginningDatetime: JSON.stringify,
    date: JSON.stringify,
    endingDatetime: JSON.stringify,
    hitsPerPage: JSON.stringify,
    locationFilter: JSON.stringify,
    offerCategories: JSON.stringify,
    offerSubcategories: JSON.stringify,
    offerIsDuo: JSON.stringify,
    offerIsFree: JSON.stringify,
    offerIsNew: JSON.stringify,
    offerTypes: JSON.stringify,
    priceRange: JSON.stringify,
    query: JSON.stringify,
    tags: JSON.stringify,
    timeRange: JSON.stringify,
    view: JSON.stringify,
    noFocus: JSON.stringify,
    previousView: JSON.stringify,
  },
  LocationFilter: {
    selectedVenue: JSON.stringify,
    selectedPlace: JSON.stringify,
  },
}
