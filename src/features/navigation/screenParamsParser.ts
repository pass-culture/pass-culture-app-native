import { AllNavParamList, RouteParams, ScreenNames } from 'features/navigation/RootNavigator'

type ParamsParsers<ScreenName extends ScreenNames> = {
  [ParamName in keyof RouteParams<AllNavParamList, ScreenName>]: (
    value: string
  ) => RouteParams<AllNavParamList, ScreenName>[ParamName]
}

type ScreenParamsParsers = {
  'signup-confirmation': ParamsParsers<'AfterSignupEmailValidationBuffer'>
}

export const screenParamsParser: ScreenParamsParsers = {
  'signup-confirmation': {
    email: (value) => decodeURIComponent(value),
    token: (value) => value,
    expiration_timestamp: (value) => Number(value),
  },
}
