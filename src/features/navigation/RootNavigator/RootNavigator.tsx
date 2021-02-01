import { NavigationContainer, Theme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ComponentType, useEffect, useMemo } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { Login } from 'features/auth/login/Login'
import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { EligibilityConfirmed } from 'features/auth/signup/EligibilityConfirmed'
import { IdCheck } from 'features/auth/signup/IdCheck'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { VerifyEligibility } from 'features/auth/signup/VerifyEligibility'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { AsyncErrorBoundary } from 'features/errors'
import { Offer, OfferDescription } from 'features/offer'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { analytics } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'
import { TabNavigator } from '../TabBar/TabNavigator'

import { RootStackParamList } from './types'

export const RootStack = createStackNavigator<RootStackParamList>()

const theme = { colors: { background: ColorsEnum.WHITE } } as Theme

interface Route {
  name: keyof RootStackParamList
  component: ComponentType<any>
  withHocsWrapper?(component: ComponentType<any>): ComponentType<any>
}

function withRetryBoundaryWithNavigation(component: ComponentType<any>) {
  return withErrorBoundary(React.memo(component), {
    FallbackComponent: AsyncErrorBoundary,
  })
}

function wrapRoute(route: Route) {
  if (route.withHocsWrapper) {
    route.component = route.withHocsWrapper(route.component)
  }

  return route
}

const routes: Array<Route> = [
  { name: 'AcceptCgu', component: AcceptCgu },
  { name: 'AccountCreated', component: AccountCreated },
  { name: 'AfterSignupEmailValidationBuffer', component: AfterSignupEmailValidationBuffer },
  { name: 'AppComponents', component: AppComponents },
  { name: 'CheatCodes', component: CheatCodes },
  { name: 'EligibilityConfirmed', component: EligibilityConfirmed },
  { name: 'ForgottenPassword', component: ForgottenPassword },
  { name: 'IdCheck', component: IdCheck },
  { name: 'LocationFilter', component: LocationFilter },
  { name: 'LocationPicker', component: LocationPicker },
  { name: 'Login', component: Login, withHocsWrapper: withRetryBoundaryWithNavigation },
  { name: 'Navigation', component: Navigation },
  { name: 'Offer', component: Offer },
  { name: 'OfferDescription', component: OfferDescription },
  { name: 'ReinitializePassword', component: ReinitializePassword },
  { name: 'ResetPasswordEmailSent', component: ResetPasswordEmailSent },
  { name: 'ResetPasswordExpiredLink', component: ResetPasswordExpiredLink },
  { name: 'SearchFilter', component: SearchFilter },
  { name: 'SetBirthday', component: SetBirthday },
  { name: 'SetEmail', component: SetEmail },
  { name: 'SetPassword', component: SetPassword },
  { name: 'SignupConfirmationEmailSent', component: SignupConfirmationEmailSent },
  { name: 'SignupConfirmationExpiredLink', component: SignupConfirmationExpiredLink },
  { name: 'TabNavigator', component: TabNavigator },
  { name: 'VerifyEligibility', component: VerifyEligibility },
]

export const RootNavigator: React.FC = () => {
  useEffect(() => {
    analytics.logScreenView('Home')
  }, [])

  const screens = useMemo(
    () =>
      routes
        .map(wrapRoute)
        .map((route) => (
          <RootStack.Screen key={route.name} name={route.name} component={route.component} />
        )),
    [routes]
  )
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        initialRouteName="TabNavigator"
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        {screens}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
