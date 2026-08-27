import { getCurrentRouteNameFromRef, resetFromRef } from 'features/navigation/navigationRef'

const ROUTES_SHOULD_NOT_BE_FORCED_LOGIN = new Set([
  'AccountStatusScreenHandler',
  'SuspiciousLoginSuspendedAccount',
  'FraudulentSuspendedAccount',
])

const shouldNotBeRedirectedToLogin = (currentRoute?: string | null): boolean => {
  return !!currentRoute && ROUTES_SHOULD_NOT_BE_FORCED_LOGIN.has(currentRoute)
}

export const navigateToLoginMethods = (params?: Record<string, unknown>) => {
  if (!shouldNotBeRedirectedToLogin(getCurrentRouteNameFromRef())) {
    resetFromRef('LoginMethods', params)
  }
}
