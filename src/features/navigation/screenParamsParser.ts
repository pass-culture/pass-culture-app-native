import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator'

type ScreensRequiringParsing = Extract<
  ScreenNames,
  'AfterSignupEmailValidationBuffer' | 'BookingDetails'
>

type ParamsParsers = {
  [Screen in ScreensRequiringParsing]: {
    [Param in keyof RouteParams<AllNavParamList, Screen>]: (
      value: string
    ) => RouteParams<AllNavParamList, Screen>[Param]
  }
}

export const screenParamsParser: ParamsParsers = {
  BookingDetails: {
    id: (value) => Number(value),
  },
  AfterSignupEmailValidationBuffer: {
    email: (value) => decodeURIComponent(value),
    token: (value) => value,
    expiration_timestamp: (value) => Number(value),
  },
}
