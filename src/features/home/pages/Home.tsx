import { useRoute } from '@react-navigation/native'
import { maxBy } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { ModalToShow, useWhichModalToShow } from 'features/home/helpers/useWhichModalToShow'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { useOnboardingSubscriptionModal } from 'features/subscription/helpers/useOnboardingSubscriptionModal'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { getAppVersion } from 'libs/packageJson'
import { BatchProfile } from 'libs/react-native-batch'
import { useBookingsQueryV2 } from 'queries/bookings'
import { useModal } from 'ui/components/modals/useModal'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  const t0 = performance.now()
  console.log(`Home start ${t0}`)
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { isLoggedIn, user } = useAuthContext()
  const { modules = [], id: homepageId } = useHomepageData() ?? {}
  const { setPlace, hasGeolocPosition, selectedLocationMode, setSelectedLocationMode } =
    useLocation()

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
  const { data: bookings, isLoading: isBookingsLoading } = useBookingsQueryV2(isLoggedIn)

  const { achievementsToShow, bookingsEligibleToReaction, modalToShow } = useWhichModalToShow(
    bookings,
    isBookingsLoading
  )

  const {
    visible: visibleAchievementModal,
    showModal: showAchievementModal,
    hideModal: hideAchievementModal,
  } = useModal(false)

  useEffect(() => {
    if (modalToShow === ModalToShow.ACHIEVEMENT) {
      showAchievementModal()
    }
  }, [showAchievementModal, modalToShow])

  useEffect(() => {
    if (homepageId) {
      analytics.logConsultHome({ homeEntryId: homepageId })
    }
  }, [homepageId])

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
    const editor = BatchProfile.editor()
    editor.setAttribute('app_version', getAppVersion())

    const allBookings = [...(bookings?.ongoingBookings || []), ...(bookings?.endedBookings || [])]
    const lastBooking = maxBy(allBookings, (booking) => booking?.dateCreated)
    if (lastBooking) {
      editor.setAttribute('last_booking_date', lastBooking.dateCreated)
    }
    if (user?.firstDepositActivationDate) {
      editor.setAttribute('credit_activation_date', user.firstDepositActivationDate)
    }

    editor.save()
  }, [bookings, user?.firstDepositActivationDate])

  const t1 = performance.now()
  console.log(`Home start of returning JSX ${t1}`)
  return (
    <React.Fragment>
      <GenericHome
        modules={modules}
        homeId={homepageId ?? ''}
        Header={<Header />}
        HomeBanner={<HomeBanner isLoggedIn={isLoggedIn} />}
        videoModuleId={params?.videoModuleId}
        statusBar={<StatusBarBlurredBackground />}
      />
      <OnboardingSubscriptionModal
        visible={onboardingSubscriptionModalVisible}
        dismissModal={hideOnboardingSubscriptionModal}
      />
      {modalToShow === ModalToShow.REACTION ? (
        <IncomingReactionModalContainer bookingsEligibleToReaction={bookingsEligibleToReaction} />
      ) : null}
      <AchievementSuccessModal
        achievementsToShow={achievementsToShow}
        visible={visibleAchievementModal}
        hideModal={hideAchievementModal}
      />
    </React.Fragment>
  )
}

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))
