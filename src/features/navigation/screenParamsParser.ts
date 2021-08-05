import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator'

type ScreensRequiringParsing = Extract<
  ScreenNames,
  | 'AfterSignupEmailValidationBuffer'
  | 'BookingDetails'
  | 'ReinitializePassword'
  | 'ResetPasswordExpiredLink'
>

type ParamsParsers = {
  [Screen in ScreensRequiringParsing]: {
    [Param in keyof RouteParams<AllNavParamList, Screen>]: (
      value: string
    ) => RouteParams<AllNavParamList, Screen>[Param]
  }
}

export const screenParamsParser: ParamsParsers = {
  AfterSignupEmailValidationBuffer: {
    email: (value) => decodeURIComponent(value),
    token: (value) => value,
    expiration_timestamp: (value) => Number(value),
  },
  BookingDetails: {
    id: (value) => Number(value),
  },
  ReinitializePassword: {
    token: (value) => value,
    email: (value) => decodeURIComponent(value),
    expiration_timestamp: (value) => Number(value),
  },
  ResetPasswordExpiredLink: {
    email: (value) => decodeURIComponent(value),
  },
}
