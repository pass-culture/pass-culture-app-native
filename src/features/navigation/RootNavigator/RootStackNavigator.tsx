import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { Artist } from 'features/artist/pages/Artist'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ForgottenPassword } from 'features/auth/pages/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/pages/forgottenPassword/ReinitializePassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/forgottenPassword/ResetPasswordEmailSent/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/forgottenPassword/ResetPasswordExpiredLink/ResetPasswordExpiredLink'
import { Login } from 'features/auth/pages/login/Login'
import { AccountCreated } from 'features/auth/pages/signup/AccountCreated/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/pages/signup/AfterSignupEmailValidationBuffer/AfterSignupEmailValidationBuffer'
import { NotYetUnderageEligibility } from 'features/auth/pages/signup/NotYetUnderageEligibility/NotYetUnderageEligibility'
import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { SignupConfirmationExpiredLink } from 'features/auth/pages/signup/SignupConfirmationExpiredLink/SignupConfirmationExpiredLink'
import { SignupForm } from 'features/auth/pages/signup/SignupForm'
import { VerifyEligibility } from 'features/auth/pages/signup/VerifyEligiblity/VerifyEligibility'
import { AccountReactivationSuccess } from 'features/auth/pages/suspendedAccount/AccountReactivationSuccess/AccountReactivationSuccess'
import { AccountStatusScreenHandler } from 'features/auth/pages/suspendedAccount/AccountStatusScreenHandler/AccountStatusScreenHandler'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { SuspendedAccountUponUserRequest } from 'features/auth/pages/suspendedAccount/SuspendedAccountUponUserRequest/SuspendedAccountUponUserRequest'
import { EighteenBirthday } from 'features/birthdayNotifications/pages/EighteenBirthday'
import { RecreditBirthdayNotification } from 'features/birthdayNotifications/pages/RecreditBirthdayNotification'
import { BookingDetails } from 'features/bookings/pages/BookingDetails/BookingDetails'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { PrivacyPolicy } from 'features/cookies/pages/PrivacyPolicy'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { DeeplinksGenerator } from 'features/internal/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/internal/pages/UTMParameters'
import { SuspenseCheatcodesStackNavigator } from 'features/navigation/CheatcodesStackNavigator/SuspenseCheatcodesStackNavigator'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { SuspenseOnboardingStackNavigator } from 'features/navigation/OnboardingStackNavigator/SuspenseOnboardingStackNavigator'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { SuspenseProfileStackNavigator } from 'features/navigation/ProfileStackNavigator/SuspenseProfileStackNavigator'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SubscriptionScreens } from 'features/navigation/RootNavigator/SubscriptionScreens'
import { SuspenseAchievements } from 'features/navigation/RootNavigator/SuspenseAchievements'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabStackNavigationStateContext'
import { TabNavigator } from 'features/navigation/TabBar/TabStackNavigator'
import { VenueMapFiltersStackNavigator } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStackNavigator'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { AccountSecurity } from 'features/trustedDevice/pages/AccountSecurity'
import { AccountSecurityBuffer } from 'features/trustedDevice/pages/AccountSecurityBuffer'
import { SuspensionChoice } from 'features/trustedDevice/pages/SuspensionChoice'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { VenuePreviewCarousel } from 'features/venue/pages/VenuePreviewCarousel/VenuePreviewCarousel'
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
import { RootStackNavigatorBase } from './Stack'

const isWeb = Platform.OS === 'web'

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    const { top } = useSafeAreaInsets()
    return (
      <IconFactoryProvider>
        <RootStackNavigatorBase.Navigator
          initialRouteName={initialRouteName}
          screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
          <RootStackNavigatorBase.Screen name="TabNavigator" component={TabNavigator} />
          <RootStackNavigatorBase.Screen name="CheatcodesStackNavigator">
            {() => <SuspenseCheatcodesStackNavigator />}
          </RootStackNavigatorBase.Screen>
          <RootStackNavigatorBase.Screen name="OnboardingStackNavigator">
            {() => <SuspenseOnboardingStackNavigator />}
          </RootStackNavigatorBase.Screen>
          <RootStackNavigatorBase.Screen name="ProfileStackNavigator">
            {() => <SuspenseProfileStackNavigator />}
          </RootStackNavigatorBase.Screen>
          {isWeb ? null : (
            <RootStackNavigatorBase.Screen
              name="VenueMapFiltersStackNavigator"
              component={VenueMapFiltersStackNavigator}
              options={{
                presentation: 'modal',
                ...FILTERS_MODAL_NAV_OPTIONS,
                cardStyle: { marginTop: top, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
              }}
            />
          )}
          <RootStackNavigatorBase.Screen name="Achievements">
            {() => <SuspenseAchievements />}
          </RootStackNavigatorBase.Screen>
          <RootStackNavigatorBase.Screen
            name="PageNotFound"
            component={PageNotFound}
            options={{ title: 'Page introuvable' }}
          />
          <RootStackNavigatorBase.Screen
            name="AccountCreated"
            component={AccountCreated}
            options={{ title: 'Compte créé\u00a0!' }}
          />
          <RootStackNavigatorBase.Screen
            name="FavoritesSorts"
            component={withAuthProtection(FavoritesSorts)}
            options={{ title: 'Tri des favoris' }}
          />
          <RootStackNavigatorBase.Screen
            name="ChangeEmailExpiredLink"
            component={ChangeEmailExpiredLink}
            options={{ title: 'Lien de modification de l’email expiré' }}
          />
          <RootStackNavigatorBase.Screen
            name="ForgottenPassword"
            component={ForgottenPassword}
            options={{ title: 'Mot de passe oublié' }}
          />
          <RootStackNavigatorBase.Screen
            name="AccountStatusScreenHandler"
            component={AccountStatusScreenHandler}
            options={{ title: 'Compte désactivé' }}
          />
          <RootStackNavigatorBase.Screen
            name="SuspendedAccountUponUserRequest"
            component={SuspendedAccountUponUserRequest}
            options={{ title: 'Compte désactivé' }}
          />
          <RootStackNavigatorBase.Screen
            name="FraudulentSuspendedAccount"
            component={FraudulentSuspendedAccount}
            options={{ title: 'Compte suspendu' }}
          />
          <RootStackNavigatorBase.Screen
            name="AccountReactivationSuccess"
            component={withAuthProtection(AccountReactivationSuccess)}
            options={{ title: 'Compte réactivé' }}
          />
          <RootStackNavigatorBase.Screen
            name="OnboardingSubscription"
            component={withAuthProtection(OnboardingSubscription)}
            options={{ title: 'Choix des thèmes à suivre' }}
          />
          <RootStackNavigatorBase.Screen
            name="ResetPasswordEmailSent"
            component={ResetPasswordEmailSent}
            options={{ title: 'Email modification mot de passe envoyé' }}
          />
          <RootStackNavigatorBase.Screen
            name="ResetPasswordExpiredLink"
            component={ResetPasswordExpiredLink}
            options={{ title: 'Email modification mot de passe expiré' }}
          />
          <RootStackNavigatorBase.Screen
            name="VerifyEligibility"
            component={VerifyEligibility}
            options={{ title: 'Vérification éligibilité' }}
          />
          <RootStackNavigatorBase.Screen
            name="NotYetUnderageEligibility"
            component={NotYetUnderageEligibility}
            options={{ title: 'C’est pour bientôt' }}
          />
          <RootStackNavigatorBase.Screen
            name="VenueMap"
            component={VenueMap}
            options={{ title: 'Carte des lieux' }}
          />
          <RootStackNavigatorBase.Screen
            name="SignupConfirmationExpiredLink"
            component={SignupConfirmationExpiredLink}
            options={{ title: 'Email création de compte expiré' }}
          />
          <RootStackNavigatorBase.Screen
            name="SignupConfirmationEmailSent"
            component={SignupConfirmationEmailSentPage}
            options={{ title: 'Email création de compte envoyé' }}
          />
          <RootStackNavigatorBase.Screen
            name="Offer"
            component={Offer}
            options={{ title: 'Offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOffer1" // Alias for 'offer/:id'
            component={Offer}
            options={{ title: 'Offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOffer2" // Alias for 'offre'
            component={Offer}
            options={{ title: 'Offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOffer3" // Alias for 'offer'
            component={Offer}
            options={{ title: 'Offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="OfferPreview"
            component={OfferPreview}
            options={{ title: 'Aperçu de l’offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOfferPreview1" // Alias for 'offer/:id/apercu'
            component={OfferPreview}
            options={{ title: 'Aperçu de l’offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOfferPreview2" // Alias for 'offre/apercu'
            component={OfferPreview}
            options={{ title: 'Aperçu de l’offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyOfferPreview3" // Alias for 'offer/apercu'
            component={OfferPreview}
            options={{ title: 'Aperçu de l’offre' }}
          />
          <RootStackNavigatorBase.Screen
            name="BookingDetails"
            component={withAuthProtection(BookingDetails)}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyBookingDetails1" // Alias for 'booking/:id/details'
            component={withAuthProtection(BookingDetails)}
          />
          <RootStackNavigatorBase.Screen
            name="BookingConfirmation"
            component={withAuthProtection(BookingConfirmation)}
            options={{ title: 'Confirmation de réservation' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyBookingConfirmation1"
            component={withAuthProtection(BookingConfirmation)}
            options={{ title: 'Confirmation de réservation' }}
          />
          <RootStackNavigatorBase.Screen
            name="EighteenBirthday"
            component={EighteenBirthday}
            options={{ title: 'Anniversaire 18 ans' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyEighteenBirthday1"
            component={EighteenBirthday}
            options={{ title: 'Anniversaire 18 ans' }}
          />
          <RootStackNavigatorBase.Screen
            name="AfterSignupEmailValidationBuffer"
            component={AfterSignupEmailValidationBuffer}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyAfterSignupEmailValidationBuffer1"
            component={AfterSignupEmailValidationBuffer}
          />
          <RootStackNavigatorBase.Screen
            name="RecreditBirthdayNotification"
            component={RecreditBirthdayNotification}
            options={{ title: 'Notification rechargement anniversaire' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyRecreditBirthdayNotification1"
            component={RecreditBirthdayNotification}
            options={{ title: 'Notification rechargement anniversaire' }}
          />
          <RootStackNavigatorBase.Screen
            name="Login"
            component={Login}
            options={{ title: 'Connexion' }}
          />
          <RootStackNavigatorBase.Screen
            name="BannedCountryError"
            component={withAsyncErrorBoundary(BannedCountryError)}
          />
          <RootStackNavigatorBase.Screen
            name="ReinitializePassword"
            component={ReinitializePassword}
            options={{ title: 'Réinitialiser le mot de passe' }}
          />
          <RootStackNavigatorBase.Screen
            name="SignupForm"
            component={SignupForm}
            options={{ title: 'Création de compte' }}
          />
          {/* SearchFilter could have been in TabNavigator > SearchStackNavigator but we don't want a tabBar on this screen */}
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlySignupForm1"
            component={SignupForm}
            options={{ title: 'Création de compte' }}
          />
          <RootStackNavigatorBase.Screen
            name="SearchFilter"
            component={SearchFilter}
            options={{ title: 'Filtres de recherche' }}
          />
          <RootStackNavigatorBase.Screen
            name="Venue"
            component={Venue}
            options={{ title: 'Lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyVenue1"
            component={Venue}
            options={{ title: 'Lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="VenuePreviewCarousel"
            component={VenuePreviewCarousel}
            options={{ title: 'Aperçu du lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyVenuePreviewCarousel1"
            component={VenuePreviewCarousel}
            options={{ title: 'Aperçu du lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyVenuePreviewCarousel2"
            component={VenuePreviewCarousel}
            options={{ title: 'Aperçu du lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyVenuePreviewCarousel3"
            component={VenuePreviewCarousel}
            options={{ title: 'Aperçu du lieu' }}
          />
          <RootStackNavigatorBase.Screen
            name="Artist"
            component={Artist}
            options={{ title: 'Artiste' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyArtist1"
            component={Artist}
            options={{ title: 'Artiste' }}
          />
          <RootStackNavigatorBase.Screen
            name="Chronicles"
            component={Chronicles}
            options={{ title: 'Avis du book club' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyChronicles1"
            component={Chronicles}
            options={{ title: 'Avis du book club' }}
          />
          <RootStackNavigatorBase.Screen
            name="UTMParameters"
            component={UTMParameters}
            options={{ title: 'Paramètres UTM' }}
          />
          <RootStackNavigatorBase.Screen
            name="DeeplinksGenerator"
            component={DeeplinksGenerator}
            options={{ title: 'Générateur de lien' }}
          />
          <RootStackNavigatorBase.Screen
            name="ThematicHome"
            component={ThematicHome}
            options={{ title: 'Page d’accueil thématique' }}
          />
          <RootStackNavigatorBase.Screen
            name="_DeeplinkOnlyThematicHome1"
            component={ThematicHome}
            options={{ title: 'Page d’accueil thématique' }}
          />
          <RootStackNavigatorBase.Screen
            name="CulturalSurveyIntro"
            component={withAuthProtection(CulturalSurveyIntro)}
            options={{ title: 'Prenons 1 minute' }}
          />
          <RootStackNavigatorBase.Screen
            name="CulturalSurveyQuestions"
            component={CulturalSurveyQuestions ?? withAuthProtection(CulturalSurveyQuestions)} // Ask reviewers (type of the screen: React.JSX.Element | null)
          />
          <RootStackNavigatorBase.Screen
            name="CulturalSurveyThanks"
            component={withAuthProtection(CulturalSurveyThanks)}
          />
          <RootStackNavigatorBase.Screen name="FAQWebview" component={FAQWebview} />
          <RootStackNavigatorBase.Screen
            name="AccountSecurityBuffer"
            component={AccountSecurityBuffer}
          />
          <RootStackNavigatorBase.Screen
            name="AccountSecurity"
            component={AccountSecurity}
            options={{ title: 'Demande de sécurisation de compte' }}
          />
          <RootStackNavigatorBase.Screen
            name="SuspensionChoice"
            component={SuspensionChoice}
            options={{ title: 'Demande de suspension de compte' }}
          />
          <RootStackNavigatorBase.Screen
            name="SuspensionChoiceExpiredLink"
            component={SuspensionChoiceExpiredLink}
            options={{ title: 'Lien de suspension de compte expiré' }}
          />
          <RootStackNavigatorBase.Screen
            name="SuspiciousLoginSuspendedAccount"
            component={SuspiciousLoginSuspendedAccount}
            options={{ title: 'Confirmation de suspension de compte' }}
          />
          {SubscriptionScreens}
        </RootStackNavigatorBase.Navigator>
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
