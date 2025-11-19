import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, Platform, ScrollView } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { shareApp } from 'features/share/helpers/shareApp'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { getAge } from 'shared/user/getAge'
import { useDebounce } from 'ui/hooks/useDebounce'
import { useVersion } from 'ui/hooks/useVersion'

const isWeb = Platform.OS === 'web'
const DEBOUNCE_TOGGLE_DELAY_MS = 5000

type ProfileViewModel = {
  disableActivation: boolean
  enablePassForAll: boolean
  enableDebugSection: boolean
  displayInAppFeedback: boolean

  isLoggedIn: boolean
  user: ReturnType<typeof useAuthContext>['user']
  userAge: number | undefined
  signOut: () => void

  isGeolocSwitchActive: boolean
  geolocPositionError: ReturnType<typeof useLocation>['geolocPositionError']
  switchGeolocation: () => Promise<void>
  debouncedLogLocationToggle: (active: boolean) => void

  isCreditEmpty: boolean
  isDepositExpired: boolean
  shouldDisplayTutorial: boolean | number | undefined
  hidePreferenceSection: boolean
  shouldShowAchievementsSection: boolean | undefined

  isWeb: boolean
  scrollViewRef: React.RefObject<ScrollView | null>
  onScroll: (event: { nativeEvent: NativeScrollEvent }) => void
  onShareBannerPress: () => void

  version: string
}

export function useProfileViewModel(): ProfileViewModel {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.PROFILE)

  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const enablePassForAll = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL)
  const enableDebugSection = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_DEBUG_SECTION)

  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { isLoggedIn, user } = useAuthContext()
  const signOut = useLogoutRoutine()
  const version = useVersion()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const userAge = getAge(user?.birthDate)

  const {
    data: { displayInAppFeedback },
  } = useRemoteConfigQuery()

  const {
    geolocPositionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()

  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(
    permissionState === GeolocPermissionState.GRANTED
  )

  const isCreditEmpty = user?.domainsCredit?.all.remaining === 0
  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false
  const isExpiredOrCreditEmptyWithNoUpcomingCredit =
    userAge && userAge >= 18 && (isDepositExpired || isCreditEmpty)
  const shouldDisplayTutorial = !user?.isBeneficiary || isExpiredOrCreditEmptyWithNoUpcomingCredit
  const hidePreferenceSection = !enableDarkMode && isWeb
  const shouldShowAchievementsSection = user?.isBeneficiary

  useFocusEffect(
    useCallback(() => {
      if (permissionState === GeolocPermissionState.GRANTED) {
        setIsGeolocSwitchActive(true)
      } else {
        setIsGeolocSwitchActive(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geolocPositionError, permissionState])
  )

  const switchGeolocation = useCallback(async () => {
    if (permissionState === GeolocPermissionState.GRANTED) {
      favoritesDispatch({ type: 'SET_SORT_BY', payload: 'RECENTLY_ADDED' })
      showGeolocPermissionModal()
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  const debouncedLogLocationToggle = useDebounce(
    analytics.logLocationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  function scrollToTop() {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }
  const debouncedScrollToTop = useDebounce(scrollToTop, 400)

  useEffect(() => {
    if (!isLoggedIn) {
      void debouncedScrollToTop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const logProfilScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      void logProfilScrolledToBottom()
    }
  }

  const onShareBannerPress = useCallback(() => {
    void analytics.logShareApp({ from: 'profile' })
    void shareApp('profile_banner')
  }, [])

  return {
    disableActivation,
    enablePassForAll,
    enableDebugSection,
    displayInAppFeedback,

    isLoggedIn,
    user,
    userAge,
    signOut,

    isGeolocSwitchActive,
    geolocPositionError,
    switchGeolocation,
    debouncedLogLocationToggle,

    isCreditEmpty,
    isDepositExpired,
    shouldDisplayTutorial,
    hidePreferenceSection,
    shouldShowAchievementsSection,

    isWeb,
    scrollViewRef,
    onScroll,
    onShareBannerPress,
    version,
  }
}
