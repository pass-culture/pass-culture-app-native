import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import {
  AnimatedCategoryThematicHomeHeader,
  MOBILE_HEADER_HEIGHT as ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT,
} from 'features/home/components/headers/AnimatedCategoryThematicHomeHeader'
import {
  AnimatedHighlightThematicHomeHeader,
  MOBILE_HEADER_HEIGHT as ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT,
} from 'features/home/components/headers/AnimatedHighlightThematicHomeHeader'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { Introduction } from 'features/home/components/headers/highlightThematic/Introduction'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { SubscribeButtonWithTooltip } from 'features/home/components/SubscribeButtonWithTooltip'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SubscriptionSuccessModal } from 'features/subscription/components/modals/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { useMapSubscriptionHomeIdsToThematic } from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { useThematicSubscription } from 'features/subscription/helpers/useThematicSubscription'
import { NotificationsLoggedOutModal } from 'features/subscription/NotificationsLoggedOutModal'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { analytics } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location/LocationWrapper'
import { storage } from 'libs/storage'
import { startTransaction } from 'shared/performance/transactions'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer } from 'ui/theme'

const MARGIN_TOP_HEADER = 6

const SubHeader: FunctionComponent<{ thematicHeader?: ThematicHeader }> = ({ thematicHeader }) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight) {
    if (Platform.OS === 'ios') {
      return (
        <React.Fragment>
          <Spacer.Column
            numberOfSpaces={ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT + MARGIN_TOP_HEADER}
          />
          {!!(thematicHeader.introductionTitle && thematicHeader.introductionParagraph) && (
            <Introduction
              title={thematicHeader.introductionTitle}
              paragraph={thematicHeader.introductionParagraph}
            />
          )}
        </React.Fragment>
      )
    }
    return <HighlightThematicHomeHeader {...thematicHeader} />
  }

  if (thematicHeader?.type === ThematicHeaderType.Category) {
    if (Platform.OS === 'ios') {
      return (
        <Spacer.Column
          numberOfSpaces={ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT + MARGIN_TOP_HEADER}
        />
      )
    }

    return (
      <CategoryThematicHomeHeader
        title={thematicHeader?.title}
        subtitle={thematicHeader?.subtitle}
        imageUrl={thematicHeader?.imageUrl}
      />
    )
  }

  return (
    <ListHeaderContainer>
      <DefaultThematicHomeHeader
        headerTitle={thematicHeader?.title}
        headerSubtitle={thematicHeader?.subtitle}
      />
    </ListHeaderContainer>
  )
}

const ThematicHeaderWithGeolocBanner: FunctionComponent<{
  thematicHeader?: ThematicHeader
  isLocated: boolean
}> = ({ thematicHeader, isLocated }) => (
  <React.Fragment>
    <SubHeader thematicHeader={thematicHeader} />
    {!isLocated && (
      <GeolocationBannerContainer>
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="pour trouver des offres autour de toi"
        />
      </GeolocationBannerContainer>
    )}
  </React.Fragment>
)

export const ThematicHome: FunctionComponent = () => {
  const startPerfHomeLoadingOnce = useFunctionOnce(() => startTransaction(PERFORMANCE_HOME_LOADING))
  const startPerfHomeCreationOnce = useFunctionOnce(() =>
    startTransaction(PERFORMANCE_HOME_CREATION)
  )
  startPerfHomeCreationOnce()
  startPerfHomeLoadingOnce()
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}
  const { userLocation } = useLocation()
  const isLocated = !!userLocation
  const { user, isLoggedIn } = useAuthContext()
  const thematic = useMapSubscriptionHomeIdsToThematic(params.homeId)

  const { showSuccessSnackBar } = useSnackBarContext()
  const {
    visible: isNotificationsModalVisible,
    showModal: showNotificationsModal,
    hideModal: hideNotificationsModal,
  } = useModal(false)
  const {
    visible: isUnsubscribingModalVisible,
    showModal: showUnsubscribingModal,
    hideModal: hideUnsubscribingModal,
  } = useModal(false)
  const {
    visible: isSubscriptionSuccessModalVisible,
    showModal: showSubscriptionSuccessModal,
    hideModal: hideSubscriptionSuccessModal,
  } = useModal(false)
  const {
    visible: visibleLoggedOutModal,
    showModal: showLoggedOutModal,
    hideModal: hideLoggedOutModal,
  } = useModal(false)

  const onUpdateSubscriptionSuccess = async () => {
    if (!thematic) return
    const hasSubscribedTimes =
      (await storage.readObject<number>('times_user_subscribed_to_a_theme')) ?? 0
    if (hasSubscribedTimes < 3) {
      showSubscriptionSuccessModal()
      await storage.saveObject('times_user_subscribed_to_a_theme', hasSubscribedTimes + 1)
    } else {
      showSuccessSnackBar({
        message: `Tu suis le thème “${mapSubscriptionThemeToName[thematic]}”\u00a0! Tu peux gérer tes alertes depuis ton profil.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const {
    isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated,
    updateSubscription,
    updateSettings,
  } = useThematicSubscription({
    user,
    thematic,
    onUpdateSubscriptionSuccess,
  })

  const onSubscribeButtonPress = () => {
    if (!isLoggedIn) {
      showLoggedOutModal()
    } else if (!isAtLeastOneNotificationTypeActivated) {
      showNotificationsModal()
    } else if (isSubscribeButtonActive) {
      showUnsubscribingModal()
    } else {
      updateSubscription()
    }
  }

  const onUnsubscribeConfirmationPress = () => {
    updateSubscription()
    hideUnsubscribingModal()
  }

  const AnimatedHeader = Animated.createAnimatedComponent(AnimatedHeaderContainer)

  const { onScroll, headerTransition, imageAnimatedHeight, gradientTranslation, viewTranslation } =
    useOpacityTransition({
      headerHeight:
        thematicHeader?.type === ThematicHeaderType.Highlight
          ? getSpacing(ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT)
          : getSpacing(ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT),
    })

  useEffect(() => {
    if (id) {
      analytics.logConsultHome({
        homeEntryId: id,
        from: params.from,
        moduleId: params.moduleId,
        moduleListId: params.moduleListId,
      })
    }
  }, [id, params.from, params.moduleId, params.moduleListId])

  return (
    <Container>
      <GenericHome
        modules={modules}
        homeId={id}
        Header={
          <React.Fragment>
            <ThematicHeaderWithGeolocBanner thematicHeader={thematicHeader} isLocated={isLocated} />
            {Platform.OS !== 'ios' && thematic ? (
              <SubscribeButtonContainer>
                <SubscribeButtonWithTooltip
                  active={isSubscribeButtonActive}
                  onPress={onSubscribeButtonPress}
                />
              </SubscribeButtonContainer>
            ) : null}
          </React.Fragment>
        }
        shouldDisplayScrollToTop
        onScroll={onScroll}
        videoModuleId={params.videoModuleId}
      />
      {/* ThematicHomeHeader is called after Body to implement the BlurView for iOS */}
      <ThematicHomeHeader title={thematicHeader?.title} headerTransition={headerTransition} />
      {/* Animated header is called only for iOS */}
      {Platform.OS === 'ios' && (
        <React.Fragment>
          {thematicHeader?.type === ThematicHeaderType.Highlight && (
            <AnimatedHeader style={{ transform: [{ translateY: viewTranslation }] }}>
              <AnimatedHighlightThematicHomeHeader
                {...thematicHeader}
                gradientTranslation={gradientTranslation}
                imageAnimatedHeight={imageAnimatedHeight}
              />
            </AnimatedHeader>
          )}
          {thematicHeader?.type === ThematicHeaderType.Category && (
            <AnimatedHeader style={{ transform: [{ translateY: viewTranslation }] }}>
              <AnimatedCategoryThematicHomeHeader
                {...thematicHeader}
                gradientTranslation={gradientTranslation}
                imageAnimatedHeight={imageAnimatedHeight}
              />
              {thematic ? (
                <SubscribeButtonContainer>
                  <SubscribeButtonWithTooltip
                    active={isSubscribeButtonActive}
                    onPress={onSubscribeButtonPress}
                  />
                </SubscribeButtonContainer>
              ) : null}
            </AnimatedHeader>
          )}
        </React.Fragment>
      )}
      {thematic ? (
        <React.Fragment>
          <NotificationsSettingsModal
            visible={isNotificationsModalVisible}
            dismissModal={hideNotificationsModal}
            theme={thematic}
            onPressSaveChanges={updateSettings}
          />
          <UnsubscribingConfirmationModal
            visible={isUnsubscribingModalVisible}
            dismissModal={hideUnsubscribingModal}
            theme={thematic}
            onUnsubscribePress={onUnsubscribeConfirmationPress}
          />
          <SubscriptionSuccessModal
            visible={isSubscriptionSuccessModalVisible}
            dismissModal={hideSubscriptionSuccessModal}
            theme={thematic}
          />
          <NotificationsLoggedOutModal
            visible={visibleLoggedOutModal}
            dismissModal={hideLoggedOutModal}
          />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const AnimatedHeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})

const GeolocationBannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  marginBottom: theme.home.spaceBetweenModules,
}))

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  right: getSpacing(4),
  top: getSpacing(40),
})
