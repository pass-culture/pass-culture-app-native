import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ForgottenPassword } from 'features/auth/pages/ForgottenPassword'
import { Login } from 'features/auth/pages/Login'
import { ReinitializePassword } from 'features/auth/pages/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/ResetPasswordExpiredLink'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { Offer } from 'features/offer'

import { onNavigationStateChange } from './services'
import { TabNavigator } from './TabBar/TabNavigator'

export type RootStackParamList = {
  TabNavigator: undefined
  Login: undefined
  Offer: { offerId: string }
  ReinitializePassword: { token: string; expiration_timestamp: number }
  IdCheck: undefined
  AppComponents: undefined
  Navigation: undefined
  CheatCodes: undefined
  ResetPasswordEmailSent: { email: string }
  ForgottenPassword: undefined
  ResetPasswordExpiredLink: { email: string }
}

const RootStack = createStackNavigator<RootStackParamList>()
export const navigationRef = React.createRef<NavigationContainerRef>()

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef}>
      <RootStack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
        <RootStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <RootStack.Screen name="Offer" component={Offer} />
        <RootStack.Screen
          name="ReinitializePassword"
          component={ReinitializePassword}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="IdCheck" component={IdCheck} options={{ headerShown: false }} />
        <RootStack.Screen name="AppComponents" component={AppComponents} />
        <RootStack.Screen name="Navigation" component={Navigation} />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
        <RootStack.Screen
          name="ResetPasswordEmailSent"
          component={ResetPasswordEmailSent}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ForgottenPassword"
          component={ForgottenPassword}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ResetPasswordExpiredLink"
          component={ResetPasswordExpiredLink}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
