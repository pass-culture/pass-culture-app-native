import { useRoute } from '@react-navigation/native'
import { maxBy } from 'lodash'
import React, { FC, FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { firstSessionAfterBookingTrigger } from 'features/subscription/helpers/shareAppTriggers/firstSessionAfterBookingTrigger'
import { twoWeeksAfterCreditTrigger } from 'features/subscription/helpers/shareAppTriggers/twoWeeksAfterCreditTrigger'
import { useOnboardingSubscriptionModal } from 'features/subscription/helpers/useOnboardingSubscriptionModal'
import {
  defaultTrigger,
  useShareAppModaleTrigger,
} from 'features/subscription/helpers/useShareAppModaleTrigger'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { getAppVersion } from 'libs/packageJson'
import { BatchUser } from 'libs/react-native-batch'
import { startTransaction } from 'shared/performance/transactions'
import { useModal } from 'ui/components/modals/useModal'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo } from 'ui/theme/typography'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme/spacing'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { useTheme } from 'styled-components/native'
import { Connect } from 'ui/svg/icons/Connect'
import { Profile } from 'ui/svg/icons/Profile'
import { AppModal } from 'ui/components/modals/AppModal'
import { OnGoingBookingItem } from 'features/bookings/components/OnGoingBookingItem'
import { bookingFixture } from 'features/home/components/modules/TrendsModule'
import { Separator } from 'ui/components/Separator'
import { Close } from 'ui/svg/icons/Close'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)
const NAME_FRIEND = 'Ricky'

export const Home: FunctionComponent = () => {
  const startPerfHomeLoadingOnce = useFunctionOnce(() => startTransaction(PERFORMANCE_HOME_LOADING))
  const startPerfHomeCreationOnce = useFunctionOnce(() =>
    startTransaction(PERFORMANCE_HOME_CREATION)
  )
  startPerfHomeCreationOnce()
  startPerfHomeLoadingOnce()

  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, id } = useHomepageData() || {}
  const { setPlace, hasGeolocPosition, selectedLocationMode, setSelectedLocationMode } =
    useLocation()
  const { isLoggedIn, user } = useAuthContext()
  const {
    visible: onboardingSubscriptionModalVisible,
    showModal: showOnboardingSubscriptionModal,
    hideModal: hideOnboardingSubscriptionModal,
  } = useModal(false)
  useOnboardingSubscriptionModal({
    isLoggedIn,
    userStatus: user?.status?.statusType,
    showOnboardingSubscriptionModal,
  })
  const { shouldApplyGraphicRedesign, shareAppTrigger } = useRemoteConfigContext()
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { data: bookings } = useBookings()

  const getShareAppTrigger = () => {
    if (shareAppTrigger === 'two_weeks_after_credit') {
      return twoWeeksAfterCreditTrigger({
        currentDate: new Date(),
        firstCreditDate: user?.firstDepositActivationDate
          ? new Date(user.firstDepositActivationDate)
          : undefined,
      })
    }
    if (shareAppTrigger === 'first_session_after_reservation') {
      return firstSessionAfterBookingTrigger({
        currentDate: new Date(),
        ongoingBookings: bookings?.ongoing_bookings ?? [],
      })
    }
    return defaultTrigger
  }
  useShareAppModaleTrigger(getShareAppTrigger())

  useEffect(() => {
    if (id) {
      analytics.logConsultHome({ homeEntryId: id })
    }
  }, [id])

  // This effect was made for the use of the marketing team (internal usage)
  useEffect(() => {
    if (params?.latitude && params?.longitude) {
      setPlace({
        geolocation: { latitude: params.latitude, longitude: params.longitude },
        label: 'Custom',
        info: 'custom',
        type: undefined,
      })
      setSelectedLocationMode(LocationMode.AROUND_PLACE)
    }
  }, [params?.latitude, params?.longitude, setPlace, setSelectedLocationMode])

  useEffect(() => {
    if (
      selectedLocationMode === LocationMode.EVERYWHERE ||
      selectedLocationMode === LocationMode.AROUND_ME
    ) {
      if (hasGeolocPosition) {
        setSelectedLocationMode(LocationMode.AROUND_ME)
      } else {
        setSelectedLocationMode(LocationMode.EVERYWHERE)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition])

  useEffect(() => {
    const editor = BatchUser.editor()
    editor
      .setAttribute('has_seen_graphique_redesign', shouldApplyGraphicRedesign)
      .setAttribute('app_version', getAppVersion())

    const allBookings = [...(bookings?.ongoing_bookings || []), ...(bookings?.ended_bookings || [])]
    const lastBooking = maxBy(allBookings, (booking) => booking?.dateCreated)
    if (lastBooking) {
      editor.setAttribute('last_booking_date', lastBooking.dateCreated)
    }
    if (user?.firstDepositActivationDate) {
      editor.setAttribute('credit_activation_date', user.firstDepositActivationDate)
    }

    editor.save()
  }, [shouldApplyGraphicRedesign, bookings, user?.firstDepositActivationDate])

  const { isDesktopViewport, colors } = useTheme()

  return (
    <React.Fragment>
      <GenericHome
        modules={modules}
        homeId={id}
        Header={<Header />}
        HomeBanner={
          <HomeBanner hasGeolocPosition={hasGeolocPosition} isLoggedIn={isLoggedIn} homeId={id} />
        }
        videoModuleId={params?.videoModuleId}
        statusBar={<StatusBarBlurredBackground />}
      />
      <OnboardingSubscriptionModal
        visible={onboardingSubscriptionModalVisible}
        dismissModal={hideOnboardingSubscriptionModal}
      />
      <AppModal
        visible={params?.duoModal !== undefined}
        title="Invitation à une offre DUO"
        rightIconAccessibilityLabel="Fermer la modale"
        rightIcon={Close}
        onRightIconPress={() => undefined}
      >
        <Typo.Title3>
          {NAME_FRIEND} t’a invité à l’accompagner sur l’offre ci-dessous
        </Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <Container>
          <OnGoingBookingItem booking={bookingFixture} />
        </Container>
        <Spacer.Column numberOfSpaces={6} />
        <InfoBanner
          icon={Profile}
          message="Crée un compte pour accéder à ton billet et bien plus encore !"
        />
        <Spacer.Column numberOfSpaces={6} />
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Créer un compte"
          navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' } }}
        />
        <Spacer.Column numberOfSpaces={4} />
        <AuthenticationContainer>
          <StyledBody>{'Déjà un compte\u00a0?'}</StyledBody>
          <InternalTouchableLink
            as={Button}
            navigateTo={{ screen: 'Login' }}
            wording='Se connecter'
            buttonColor={colors.secondary}
            icon={Connect}
            onBeforeNavigate={() => undefined}
          />
        </AuthenticationContainer>
      </AppModal >

      {isReactionFeatureActive ? <IncomingReactionModalContainer /> : null}
    </React.Fragment >
  )
}

const Container = styled.View({
  marginLeft: getSpacing(-6)
})

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const AuthenticationContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: getSpacing(1),
})

const Button: FC<ButtonInsideTexteProps> = ({
  onPress,
  onLongPress,
  wording,
  icon,
  buttonColor,
  typography,
  accessibilityLabel,
  accessibilityRole,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || wording}>
      <ButtonInsideTextInner
        wording={wording}
        icon={icon}
        color={buttonColor}
        typography={typography}
        disablePadding
      />
    </TouchableOpacity>
  )
}
