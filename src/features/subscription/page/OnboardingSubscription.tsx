import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SUBSCRIPTION_THEMATIC_ICONS } from 'features/subscription/components/subscriptionThematicIcons'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme, SUSBCRIPTION_THEMES } from 'features/subscription/types'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { CheckboxGroup } from 'ui/designSystem/CheckboxGroup/CheckboxGroup'
import { CheckboxGroupOption } from 'ui/designSystem/CheckboxGroup/types'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Invalidate } from 'ui/svg/icons/Invalidate'

export const OnboardingSubscription = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavigationConfig)
  const { user } = useAuthContext()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const {
    visible: isNotificationsModalVisible,
    showModal: showNotificationsModal,
    hideModal: hideNotificationsModal,
  } = useModal(false)

  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'

  const isAtLeastOneNotificationTypeActivated =
    Platform.OS === 'web'
      ? user?.subscriptions?.marketingEmail
      : (isPushPermissionGranted && user?.subscriptions?.marketingPush) ||
        user?.subscriptions?.marketingEmail

  const initialSubscribedThemes: SubscriptionTheme[] = (user?.subscriptions?.subscribedThemes ??
    []) as SubscriptionTheme[]

  const [subscribedThemes, setSubscribedThemes] =
    useState<SubscriptionTheme[]>(initialSubscribedThemes)

  const { mutate: patchProfile, isPending: isUpdatingProfile } = usePatchProfileMutation({
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

  const isValidateButtonDisabled = subscribedThemes.length === 0 || isUpdatingProfile

  const checkboxOptions: CheckboxGroupOption<SubscriptionTheme>[] = SUSBCRIPTION_THEMES.map(
    (theme) => ({
      label: mapSubscriptionThemeToName[theme],
      value: theme,
      variant: 'detailed',
      asset: { variant: 'icon', Icon: SUBSCRIPTION_THEMATIC_ICONS[theme] },
    })
  )

  return (
    <PageWithHeader
      title="Thèmes"
      onGoBack={goBack}
      scrollChildren={
        <React.Fragment>
          <CheckboxGroupContainer>
            <CheckboxGroup<SubscriptionTheme>
              label="Choisis des thèmes à suivre"
              labelTag="h2"
              description=" Tu recevras des notifs et/ou des mails pour ne rien rater des dernières sorties et actus&nbsp;!"
              options={checkboxOptions}
              value={subscribedThemes}
              onChange={(values) => setSubscribedThemes(values as SubscriptionTheme[])}
              display="vertical"
              variant="detailed"
            />
          </CheckboxGroupContainer>
          <NotificationsSettingsModal
            visible={isNotificationsModalVisible}
            title="Suivre la sélection"
            description="Pour recevoir toute l’actu de tes thèmes favoris, tu dois, au choix&nbsp;:"
            dismissModal={hideNotificationsModal}
            onPressSaveChanges={updateSubscription}
          />
        </React.Fragment>
      }
      fixedBottomChildren={
        <StyledView gap={5}>
          <Button
            wording="Suivre la sélection"
            onPress={onSubmit}
            disabled={isValidateButtonDisabled}
            fullWidth
          />
          <Button
            variant="tertiary"
            color="neutral"
            wording="Non merci"
            accessibilityLabel="Ne pas suivre de thème"
            icon={Invalidate}
            onPress={goBack}
          />
        </StyledView>
      }
    />
  )
}

const CheckboxGroupContainer = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
}))

const StyledView = styled(ViewGap)({
  alignItems: 'center',
})
