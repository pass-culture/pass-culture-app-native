import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ForgottenPassword } from 'features/auth/pages/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/forgottenPassword/ResetPasswordEmailSent/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/forgottenPassword/ResetPasswordExpiredLink/ResetPasswordExpiredLink'
import { AccountCreated } from 'features/auth/pages/signup/AccountCreated/AccountCreated'
import { NotYetUnderageEligibility } from 'features/auth/pages/signup/NotYetUnderageEligibility/NotYetUnderageEligibility'
import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { SignupConfirmationExpiredLink } from 'features/auth/pages/signup/SignupConfirmationExpiredLink/SignupConfirmationExpiredLink'
import { VerifyEligibility } from 'features/auth/pages/signup/VerifyEligiblity/VerifyEligibility'
import { AccountReactivationSuccess } from 'features/auth/pages/suspendedAccount/AccountReactivationSuccess/AccountReactivationSuccess'
import { AccountStatusScreenHandler } from 'features/auth/pages/suspendedAccount/AccountStatusScreenHandler/AccountStatusScreenHandler'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { SuspendedAccountUponUserRequest } from 'features/auth/pages/suspendedAccount/SuspendedAccountUponUserRequest/SuspendedAccountUponUserRequest'
import { PrivacyPolicy } from 'features/cookies/pages/PrivacyPolicy'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { SuspenseCheatcodesStackNavigator } from 'features/navigation/CheatcodesStackNavigator/SuspenseCheatcodesStackNavigator'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { SuspenseOnboardingStackNavigator } from 'features/navigation/OnboardingStackNavigator/SuspenseOnboardingStackNavigator'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { SuspenseProfileStackNavigator } from 'features/navigation/ProfileStackNavigator/SuspenseProfileStackNavigator'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SuspenseAchievements } from 'features/navigation/RootNavigator/SuspenseAchievements'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { VenueMapFiltersStackNavigator } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStackNavigator'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { determineAccessibilityRole } from './determineAccessibilityRole'
import { FILTERS_MODAL_NAV_OPTIONS } from './filtersModalNavOptions'
import { Header } from './Header/Header'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from './navigationOptions'
import { RootScreens } from './screens'
import { RootStack } from './Stack'

const isWeb = Platform.OS === 'web'

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    const { top } = useSafeAreaInsets()
    return (
      <IconFactoryProvider>
        <RootStack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
          <RootStack.Screen name="CheatcodesStackNavigator">
            {() => <SuspenseCheatcodesStackNavigator />}
          </RootStack.Screen>
          <RootStack.Screen name="OnboardingStackNavigator">
            {() => <SuspenseOnboardingStackNavigator />}
          </RootStack.Screen>
          <RootStack.Screen name="ProfileStackNavigator">
            {() => <SuspenseProfileStackNavigator />}
          </RootStack.Screen>
          {isWeb ? null : (
            <RootStack.Screen
              name="VenueMapFiltersStackNavigator"
              component={VenueMapFiltersStackNavigator}
              options={{
                presentation: 'modal',
                ...FILTERS_MODAL_NAV_OPTIONS,
                cardStyle: { marginTop: top, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
              }}
            />
          )}
          {RootScreens}
          <RootStack.Screen name="Achievements">{() => <SuspenseAchievements />}</RootStack.Screen>
          <RootStack.Screen
            name="PageNotFound"
            component={PageNotFound}
            options={{ title: 'Page introuvable' }}
          />
          <RootStack.Screen
            name="AccountCreated"
            component={AccountCreated}
            options={{ title: 'Compte créé\u00a0!' }}
          />
          <RootStack.Screen
            name="FavoritesSorts"
            component={withAuthProtection(FavoritesSorts)}
            options={{ title: 'Tri des favoris' }}
          />
          <RootStack.Screen
            name="ChangeEmailExpiredLink"
            component={ChangeEmailExpiredLink}
            options={{ title: 'Lien de modification de l’email expiré' }}
          />
          <RootStack.Screen
            name="ForgottenPassword"
            component={ForgottenPassword}
            options={{ title: 'Mot de passe oublié' }}
          />
          <RootStack.Screen
            name="AccountStatusScreenHandler"
            component={AccountStatusScreenHandler}
            options={{ title: 'Compte désactivé' }}
          />
          <RootStack.Screen
            name="SuspendedAccountUponUserRequest"
            component={SuspendedAccountUponUserRequest}
            options={{ title: 'Compte désactivé' }}
          />
          <RootStack.Screen
            name="FraudulentSuspendedAccount"
            component={FraudulentSuspendedAccount}
            options={{ title: 'Compte suspendu' }}
          />
          <RootStack.Screen
            name="AccountReactivationSuccess"
            component={withAuthProtection(AccountReactivationSuccess)}
            options={{ title: 'Compte réactivé' }}
          />
          <RootStack.Screen
            name="OnboardingSubscription"
            component={withAuthProtection(OnboardingSubscription)}
            options={{ title: 'Choix des thèmes à suivre' }}
          />
          <RootStack.Screen
            name="ResetPasswordEmailSent"
            component={ResetPasswordEmailSent}
            options={{ title: 'Email modification mot de passe envoyé' }}
          />
          <RootStack.Screen
            name="ResetPasswordExpiredLink"
            component={ResetPasswordExpiredLink}
            options={{ title: 'Email modification mot de passe expiré' }}
          />
          <RootStack.Screen
            name="VerifyEligibility"
            component={VerifyEligibility}
            options={{ title: 'Vérification éligibilité' }}
          />
          <RootStack.Screen
            name="NotYetUnderageEligibility"
            component={NotYetUnderageEligibility}
            options={{ title: 'C’est pour bientôt' }}
          />
          <RootStack.Screen
            name="VenueMap"
            component={VenueMap}
            options={{ title: 'Carte des lieux' }}
          />
          <RootStack.Screen
            name="SignupConfirmationExpiredLink"
            component={SignupConfirmationExpiredLink}
            options={{ title: 'Email création de compte expiré' }}
          />
          <RootStack.Screen
            name="SignupConfirmationEmailSent"
            component={SignupConfirmationEmailSentPage}
            options={{ title: 'Email création de compte envoyé' }}
          />
        </RootStack.Navigator>
      </IconFactoryProvider>
    )
  }
)

export const RootNavigator: React.ComponentType = () => {
  const mainId = uuidv4()
  const tabBarId = uuidv4()
  const { showTabBar } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const { isSplashScreenHidden } = useSplashScreenContext()

  const initialScreen = useInitialScreen()

  const currentRoute = useCurrentRoute()
  const showHeaderQuickAccess = currentRoute && currentRoute.name === 'TabNavigator'
  const headerWithQuickAccess = showHeaderQuickAccess ? (
    <QuickAccess href={`#${tabBarId}`} title="Accéder au menu de navigation" />
  ) : null

  useEffect(() => {
    const incrementLoggedInSessionCount = async () => {
      const loggedInSessionCount =
        (await storage.readObject<number>('logged_in_session_count')) || 0
      await storage.saveObject('logged_in_session_count', loggedInSessionCount + 1)
    }

    if (isLoggedIn) {
      incrementLoggedInSessionCount()
    }
  }, [isLoggedIn])

  if (!initialScreen) {
    return <LoadingPage />
  }

  const mainAccessibilityRole: AccessibilityRole | undefined =
    determineAccessibilityRole(currentRoute)

  return (
    <TabNavigationStateProvider>
      {showTabBar ? headerWithQuickAccess : <Header mainId={mainId} />}
      <Main nativeID={mainId} accessibilityRole={mainAccessibilityRole}>
        <RootStackNavigator initialRouteName={initialScreen} />
      </Main>
      {showTabBar ? (
        <View accessibilityRole={AccessibilityRole.FOOTER}>
          <AccessibleTabBar id={tabBarId} />
        </View>
      ) : null}
      {/* The components below are those for which we do not want their rendering to happen while the splash is displayed. */}
      {isSplashScreenHidden ? <PrivacyPolicy /> : null}
    </TabNavigationStateProvider>
  )
}

const Main = styled.View({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})
