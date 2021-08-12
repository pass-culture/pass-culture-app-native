import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator'

type ScreensRequiringParsing = Extract<
  ScreenNames,
  | 'AfterSignupEmailValidationBuffer'
  | 'BookingDetails'
  | 'Home'
  | 'Login'
  | 'Offer'
  | 'ReinitializePassword'
  | 'ResetPasswordExpiredLink'
  | 'Venue'
  | 'Search'
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
  AfterSignupEmailValidationBuffer: {
    email: decodeURIComponent,
    token: identityFn,
    expiration_timestamp: Number,
  },
  BookingDetails: {
    id: Number,
  },
  Login: {
    preventCancellation: parseObject,
    followScreen: identityFn,
    followParams: parseObject,
  },
  Offer: {
    id: (value) => (value ? Number(value) : 0),
    from: identityFn,
    moduleName: identityFn,
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
    aroundRadius: Number,
    beginningDatetime: identityFn,
    date: JSON.parse,
    endingDatetime: identityFn,
    geolocation: JSON.parse,
    hitsPerPage: Number,
    locationType: identityFn,
    offerCategories: JSON.parse,
    offerIsDuo: Boolean,
    offerIsFree: Boolean,
    offerIsNew: Boolean,
    offerTypes: JSON.parse,
    place: JSON.parse,
    priceRange: identityFn,
    query: identityFn,
    showResults: Boolean,
    tags: identityFn,
    timeRange: identityFn,
    venueId: Number,
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

type ScreensRequiringStringifying = Extract<ScreenNames, 'Search'>
type ParamsStringifiers = {
  [Screen in ScreensRequiringStringifying]: {
    [Param in keyof Required<RouteParams<ParamsList, Screen>>]:
      | ((value: RouteParams<ParamsList, Screen>[Param]) => string)
      | undefined
  }
}

export const screenParamsStringifier: ParamsStringifiers = {
  Search: {
    aroundRadius: identityFn,
    beginningDatetime: identityFn,
    date: JSON.stringify,
    endingDatetime: identityFn,
    geolocation: JSON.stringify,
    hitsPerPage: identityFn,
    locationType: identityFn,
    // @ts-ignore this is a test
    offerCategories: undefined,
    offerIsDuo: String,
    offerIsFree: String,
    offerIsNew: String,
    offerTypes: JSON.stringify,
    place: JSON.stringify,
    priceRange: identityFn,
    query: identityFn,
    showResults: String,
    tags: undefined,
    timeRange: identityFn,
    venueId: identityFn,
  },
}
