import { NavigationContainer, Theme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'

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
import { Offer, OfferDescription } from 'features/offer'
import { Categories as SearchCategories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { FirstTutorial } from 'features/tutorials/pages/FirstTutorial'
import { analytics } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'
import { TabNavigator } from '../TabBar/TabNavigator'

import { RootStackParamList } from './types'

export const RootStack = createStackNavigator<RootStackParamList>()

const theme = { colors: { background: ColorsEnum.WHITE } } as Theme

export const RootNavigator: React.FC = () => {
  useEffect(() => {
    analytics.logScreenView('Home')
  }, [])
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        initialRouteName="TabNavigator"
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AcceptCgu" component={AcceptCgu} />
        <RootStack.Screen name="AccountCreated" component={AccountCreated} />
        <RootStack.Screen
          name="AfterSignupEmailValidationBuffer"
          component={AfterSignupEmailValidationBuffer}
        />
        <RootStack.Screen name="AppComponents" component={AppComponents} />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
        <RootStack.Screen name="EligibilityConfirmed" component={EligibilityConfirmed} />
        <RootStack.Screen name="ForgottenPassword" component={ForgottenPassword} />
        <RootStack.Screen name="IdCheck" component={IdCheck} />
        <RootStack.Screen name="SearchCategories" component={SearchCategories} />
        <RootStack.Screen name="LocationFilter" component={LocationFilter} />
        <RootStack.Screen name="LocationPicker" component={LocationPicker} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Navigation" component={Navigation} />
        <RootStack.Screen name="Offer" component={Offer} />
        <RootStack.Screen name="OfferDescription" component={OfferDescription} />
        <RootStack.Screen name="ReinitializePassword" component={ReinitializePassword} />
        <RootStack.Screen name="ResetPasswordEmailSent" component={ResetPasswordEmailSent} />
        <RootStack.Screen name="ResetPasswordExpiredLink" component={ResetPasswordExpiredLink} />
        <RootStack.Screen name="SearchFilter" component={SearchFilter} />
        <RootStack.Screen name="SetBirthday" component={SetBirthday} />
        <RootStack.Screen name="SetEmail" component={SetEmail} />
        <RootStack.Screen name="SetPassword" component={SetPassword} />
        <RootStack.Screen
          name="SignupConfirmationEmailSent"
          component={SignupConfirmationEmailSent}
        />
        <RootStack.Screen
          name="SignupConfirmationExpiredLink"
          component={SignupConfirmationExpiredLink}
        />
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
        <RootStack.Screen name="VerifyEligibility" component={VerifyEligibility} />
        <RootStack.Screen name="FirstTutorial" component={FirstTutorial} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
