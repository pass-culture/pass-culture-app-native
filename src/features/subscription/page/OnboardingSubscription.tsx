import { useNavigation } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { FlatList, Platform, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig, homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SubscriptionThematicButton } from 'features/subscription/components/buttons/SubscriptionThematicButton'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme, SUSBCRIPTION_THEMES } from 'features/subscription/types'
import { analytics } from 'libs/analytics/provider'
import { AnimatedViewRefType, createAnimatableComponent } from 'libs/react-native-animatable'
import { storage } from 'libs/storage'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { EmptyHeader } from 'ui/components/headers/EmptyHeader'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Page } from 'ui/pages/Page'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const GRADIENT_HEIGHT = getSpacing(30)
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

export const OnboardingSubscription = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabHookConfig('Home'))
  const { user } = useAuthContext()
  const theme = useTheme()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const {
    visible: isNotificationsModalVisible,
    showModal: showNotificationsModal,
    hideModal: hideNotificationsModal,
  } = useModal(false)
  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'
  const gradientRef = useRef<AnimatedViewRefType>(null)

  const isAtLeastOneNotificationTypeActivated =
    Platform.OS === 'web'
      ? user?.subscriptions?.marketingEmail
      : (isPushPermissionGranted && user?.subscriptions?.marketingPush) ||
        user?.subscriptions?.marketingEmail

  const initialSubscribedThemes: SubscriptionTheme[] = (user?.subscriptions?.subscribedThemes ??
    []) as SubscriptionTheme[]

  const [subscribedThemes, checkSubscribedTheme] = useReducer(
    (state: SubscriptionTheme[], action: SubscriptionTheme) => {
      if (state.includes(action)) {
        return state.filter((theme) => theme !== action)
      }
      return [...state, action]
    },
    initialSubscribedThemes
  )

  const { mutate: patchProfile, isLoading: isUpdatingProfile } = usePatchProfileMutation({
    onSuccess: () => {
      analytics.logSubscriptionUpdate({ type: 'update', from: 'home' })
      showSuccessSnackBar({
        message: 'Thèmes suivis\u00a0! Tu peux gérer tes alertes depuis ton profil.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      replace(...homeNavigationConfig)
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue, tu peux réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const isThemeChecked = (theme: SubscriptionTheme) => subscribedThemes.includes(theme)

  const isValidateButtonDisabled = subscribedThemes.length === 0 || isUpdatingProfile

  const renderItem = ({ item }: { item: SubscriptionTheme }) => {
    return (
      <SubscriptionThematicButtonContainer key={item}>
        <SubscriptionThematicButton
          thematic={item}
          checked={isThemeChecked(item)}
          onPress={() => checkSubscribedTheme(item)}
        />
      </SubscriptionThematicButtonContainer>
    )
  }

  const updateSubscription = useCallback(
    (notifications: { allowEmails: boolean; allowPush: boolean }) => {
      patchProfile({
        subscriptions: {
          marketingEmail: notifications.allowEmails,
          marketingPush: notifications.allowPush,
          subscribedThemes,
        },
        origin: 'OnboardingSubscription',
      })
    },
    [subscribedThemes, patchProfile]
  )

  const onSubmit = useCallback(() => {
    if (isAtLeastOneNotificationTypeActivated) {
      updateSubscription({
        allowEmails: user?.subscriptions?.marketingEmail || false,
        allowPush: user?.subscriptions?.marketingPush || false,
      })
    } else {
      showNotificationsModal()
    }
  }, [
    isAtLeastOneNotificationTypeActivated,
    user?.subscriptions?.marketingEmail,
    user?.subscriptions?.marketingPush,
    showNotificationsModal,
    updateSubscription,
  ])

  useEffect(() => {
    storage.saveObject('has_seen_onboarding_subscription', true)
  }, [])

  const contentContainerStyle: ViewStyle = {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  }

  const { onViewableItemsChanged } = useOnViewableItemsChanged(gradientRef, SUSBCRIPTION_THEMES)

  return (
    <Page>
      <EmptyHeader />
      <FlatList
        data={SUSBCRIPTION_THEMES}
        renderItem={renderItem}
        keyExtractor={(item) => mapSubscriptionThemeToName[item]}
        ListHeaderComponent={
          <React.Fragment>
            <StyledTitle3>Choisis des thèmes à suivre</StyledTitle3>
            <StyledBody>
              Tu recevras des notifs et/ou des mails pour ne rien rater des dernières sorties et
              actus&nbsp;!
            </StyledBody>
          </React.Fragment>
        }
        contentContainerStyle={contentContainerStyle}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
      <Gradient ref={gradientRef} />
      <StyledView>
        <ButtonPrimary
          wording="Suivre la sélection"
          onPress={onSubmit}
          disabled={isValidateButtonDisabled}
        />
        <ButtonTertiaryBlack
          wording="Non merci"
          accessibilityLabel="Ne pas suivre de thème"
          icon={Invalidate}
          onPress={goBack}
        />
      </StyledView>
      <NotificationsSettingsModal
        visible={isNotificationsModalVisible}
        title="Suivre la sélection"
        description="Pour recevoir toute l’actu de tes thèmes favoris, tu dois, au choix&nbsp;:"
        dismissModal={hideNotificationsModal}
        onPressSaveChanges={updateSubscription}
      />
    </Page>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  marginBottom: getSpacing(4),
})

const StyledBody = styled(Typo.Body)({
  marginBottom: getSpacing(6),
})

const StyledView = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
  padding: getSpacing(4),
  gap: getSpacing(5),
  paddingBottom: getSpacing(6),
}))

const SubscriptionThematicButtonContainer = styled.View({
  paddingVertical: getSpacing(2),
})

const AnimatedGradient = createAnimatableComponent(LinearGradient)
const Gradient = styled(AnimatedGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.default, 0),
    theme.designSystem.color.background.default,
  ],
  locations: [0, 1],
  pointerEvents: 'none',
}))({
  position: 'absolute',
  bottom: getSpacing(34),
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
})
