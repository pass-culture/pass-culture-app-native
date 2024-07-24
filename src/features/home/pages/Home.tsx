import { useRoute } from '@react-navigation/native'
import { maxBy } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { useAttrakdiffModal } from 'features/home/api/useAttrakdiffModal'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { useOnboardingSubscriptionModal } from 'features/subscription/helpers/useOnboardingSubscriptionModal'
import { analytics } from 'libs/analytics'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { getAppVersion } from 'libs/packageJson'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { startTransaction } from 'shared/performance/transactions'
import { useModal } from 'ui/components/modals/useModal'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'

import { createInMemoryAttrakdiff } from '../api/inMemoryAttrakdiff'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

const attrakdiff = createInMemoryAttrakdiff()

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
  const { height } = useWindowDimensions()
  const { shouldApplyGraphicRedesign } = useRemoteConfigContext()

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

  const { data: bookings } = useBookings()

  const triggerBatchAttrakdiffModal = async () => {
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
    BatchUser.trackEvent(BatchEvent.hasSeenEnoughHomeContent)
  }

  const { checkTrigger } = useAttrakdiffModal({
    screenHeight: height,
    onTrigger: triggerBatchAttrakdiffModal,
    attrakdiff,
  })

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
        onScroll={({ nativeEvent }) => {
          checkTrigger(nativeEvent.contentOffset.y)
        }}
      />
      <OnboardingSubscriptionModal
        visible={onboardingSubscriptionModalVisible}
        dismissModal={hideOnboardingSubscriptionModal}
      />
    </React.Fragment>
  )
}

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))
