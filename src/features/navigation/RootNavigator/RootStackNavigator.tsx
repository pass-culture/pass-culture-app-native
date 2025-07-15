import { StackNavigationOptions } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ArtistPage } from 'features/artist/pages/ArtistPage/ArtistPage'
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
import { SuspenseAchievements } from 'features/navigation/RootNavigator/SuspenseAchievements'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { SuspenseSubscriptionStackNavigator } from 'features/navigation/SubscriptionStackNavigator/SuspenseSubscriptionStackNavigator'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigator } from 'features/navigation/TabBar/TabStackNavigator'
import { VenueMapFiltersStackNavigator } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStackNavigator'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { OfferVideoPreview } from 'features/offer/pages/OfferVideoPreview/OfferVideoPreview'
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

// By defining routes as a configuration array, we can easily apply universal HOCs.
type RouteConfig = {
  name: RootScreenNames
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options?: StackNavigationOptions
}

const rootScreens: RouteConfig[] = [
  {
    name: 'PageNotFound',
    component: PageNotFound,
    options: { title: 'Page introuvable' },
  },
  {
    name: 'AccountCreated',
    component: AccountCreated,
    options: { title: 'Compte créé\u00a0!' },
  },
  {
    name: 'FavoritesSorts',
    component: withAuthProtection(FavoritesSorts),
    options: { title: 'Tri des favoris' },
  },
  {
    name: 'ChangeEmailExpiredLink',
    component: ChangeEmailExpiredLink,
    options: { title: 'Lien de modification de l’email expiré' },
  },
  {
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    options: { title: 'Mot de passe oublié' },
  },
  {
    name: 'AccountStatusScreenHandler',
    component: AccountStatusScreenHandler,
    options: { title: 'Compte désactivé' },
  },
  {
    name: 'SuspendedAccountUponUserRequest',
    component: SuspendedAccountUponUserRequest,
    options: { title: 'Compte désactivé' },
  },
  {
    name: 'FraudulentSuspendedAccount',
    component: FraudulentSuspendedAccount,
    options: { title: 'Compte suspendu' },
  },
  {
    name: 'AccountReactivationSuccess',
    component: withAuthProtection(AccountReactivationSuccess),
    options: { title: 'Compte réactivé' },
  },
  {
    name: 'OnboardingSubscription',
    component: withAuthProtection(OnboardingSubscription),
    options: { title: 'Choix des thèmes à suivre' },
  },
  {
    name: 'ResetPasswordEmailSent',
    component: ResetPasswordEmailSent,
    options: { title: 'Email modification mot de passe envoyé' },
  },
  {
    name: 'ResetPasswordExpiredLink',
    component: ResetPasswordExpiredLink,
    options: { title: 'Email modification mot de passe expiré' },
  },
  {
    name: 'VerifyEligibility',
    component: VerifyEligibility,
    options: { title: 'Vérification éligibilité' },
  },
  {
    name: 'NotYetUnderageEligibility',
    component: NotYetUnderageEligibility,
    options: { title: 'C’est pour bientôt' },
  },
  { name: 'VenueMap', component: VenueMap, options: { title: 'Carte des lieux' } },
  {
    name: 'SignupConfirmationExpiredLink',
    component: SignupConfirmationExpiredLink,
    options: { title: 'Email création de compte expiré' },
  },
  {
    name: 'SignupConfirmationEmailSent',
    component: SignupConfirmationEmailSentPage,
    options: { title: 'Email création de compte envoyé' },
  },
  { name: 'Offer', component: Offer, options: { title: 'Offre' } },
  { name: '_DeeplinkOnlyOffer1', component: Offer, options: { title: 'Offre' } },
  { name: '_DeeplinkOnlyOffer2', component: Offer, options: { title: 'Offre' } },
  { name: '_DeeplinkOnlyOffer3', component: Offer, options: { title: 'Offre' } },
  {
    name: 'OfferPreview',
    component: OfferPreview,
    options: { title: 'Aperçu de l’offre' },
  },
  {
    name: '_DeeplinkOnlyOfferPreview1',
    component: OfferPreview,
    options: { title: 'Aperçu de l’offre' },
  },
  {
    name: '_DeeplinkOnlyOfferPreview2',
    component: OfferPreview,
    options: { title: 'Aperçu de l’offre' },
  },
  {
    name: '_DeeplinkOnlyOfferPreview3',
    component: OfferPreview,
    options: { title: 'Aperçu de l’offre' },
  },
  {
    name: 'OfferVideoPreview',
    component: OfferVideoPreview,
    options: {
      title: 'Vidéo de l’offre',
      presentation: 'modal',
      ...FILTERS_MODAL_NAV_OPTIONS,
    },
  },
  { name: 'BookingDetails', component: withAuthProtection(BookingDetails) },
  {
    name: '_DeeplinkOnlyBookingDetails1',
    component: withAuthProtection(BookingDetails),
  },
  {
    name: 'BookingConfirmation',
    component: withAuthProtection(BookingConfirmation),
    options: { title: 'Confirmation de réservation' },
  },
  {
    name: '_DeeplinkOnlyBookingConfirmation1',
    component: withAuthProtection(BookingConfirmation),
    options: { title: 'Confirmation de réservation' },
  },
  {
    name: 'EighteenBirthday',
    component: EighteenBirthday,
    options: { title: 'Anniversaire 18 ans' },
  },
  {
    name: '_DeeplinkOnlyEighteenBirthday1',
    component: EighteenBirthday,
    options: { title: 'Anniversaire 18 ans' },
  },
  {
    name: 'AfterSignupEmailValidationBuffer',
    component: AfterSignupEmailValidationBuffer,
  },
  {
    name: '_DeeplinkOnlyAfterSignupEmailValidationBuffer1',
    component: AfterSignupEmailValidationBuffer,
  },
  {
    name: 'RecreditBirthdayNotification',
    component: RecreditBirthdayNotification,
    options: { title: 'Notification rechargement anniversaire' },
  },
  {
    name: '_DeeplinkOnlyRecreditBirthdayNotification1',
    component: RecreditBirthdayNotification,
    options: { title: 'Notification rechargement anniversaire' },
  },
  { name: 'Login', component: Login, options: { title: 'Connexion' } },
  { name: 'BannedCountryError', component: BannedCountryError },
  {
    name: 'ReinitializePassword',
    component: ReinitializePassword,
    options: { title: 'Réinitialiser le mot de passe' },
  },
  { name: 'SignupForm', component: SignupForm, options: { title: 'Création de compte' } },
  {
    name: '_DeeplinkOnlySignupForm1',
    component: SignupForm,
    options: { title: 'Création de compte' },
  },
  {
    name: 'SearchFilter',
    component: SearchFilter,
    options: { title: 'Filtres de recherche' },
  },
  { name: 'Venue', component: Venue, options: { title: 'Lieu' } },
  { name: '_DeeplinkOnlyVenue1', component: Venue, options: { title: 'Lieu' } },
  {
    name: 'VenuePreviewCarousel',
    component: VenuePreviewCarousel,
    options: { title: 'Aperçu du lieu' },
  },
  {
    name: '_DeeplinkOnlyVenuePreviewCarousel1',
    component: VenuePreviewCarousel,
    options: { title: 'Aperçu du lieu' },
  },
  {
    name: '_DeeplinkOnlyVenuePreviewCarousel2',
    component: VenuePreviewCarousel,
    options: { title: 'Aperçu du lieu' },
  },
  {
    name: '_DeeplinkOnlyVenuePreviewCarousel3',
    component: VenuePreviewCarousel,
    options: { title: 'Aperçu du lieu' },
  },
  { name: 'Artist', component: ArtistPage, options: { title: 'Artiste' } },
  { name: '_DeeplinkOnlyArtist1', component: ArtistPage, options: { title: 'Artiste' } },
  {
    name: 'Chronicles',
    component: Chronicles,
    options: { title: 'Avis du book club' },
  },
  {
    name: '_DeeplinkOnlyChronicles1',
    component: Chronicles,
    options: { title: 'Avis du book club' },
  },
  {
    name: 'UTMParameters',
    component: UTMParameters,
    options: { title: 'Paramètres UTM' },
  },
  {
    name: 'DeeplinksGenerator',
    component: DeeplinksGenerator,
    options: { title: 'Générateur de lien' },
  },
  {
    name: 'ThematicHome',
    component: ThematicHome,
    options: { title: 'Page d’accueil thématique' },
  },
  {
    name: '_DeeplinkOnlyThematicHome1',
    component: ThematicHome,
    options: { title: 'Page d’accueil thématique' },
  },
  { name: 'AccountSecurityBuffer', component: AccountSecurityBuffer },
  {
    name: 'AccountSecurity',
    component: AccountSecurity,
    options: { title: 'Demande de sécurisation de compte' },
  },
  {
    name: 'SuspensionChoice',
    component: SuspensionChoice,
    options: { title: 'Demande de suspension de compte' },
  },
  {
    name: 'SuspensionChoiceExpiredLink',
    component: SuspensionChoiceExpiredLink,
    options: { title: 'Lien de suspension de compte expiré' },
  },
  {
    name: 'SuspiciousLoginSuspendedAccount',
    component: SuspiciousLoginSuspendedAccount,
    options: { title: 'Confirmation de suspension de compte' },
  },
]

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
          <RootStackNavigatorBase.Screen name="SubscriptionStackNavigator">
            {() => <SuspenseSubscriptionStackNavigator />}
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

          {rootScreens.map(({ name, component, options }) => (
            <RootStackNavigatorBase.Screen
              key={name}
              name={name}
              component={withAsyncErrorBoundary(component)}
              options={options}
            />
          ))}
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
