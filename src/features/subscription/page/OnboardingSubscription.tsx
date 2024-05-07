import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useReducer } from 'react'
import { FlatList, Platform, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig, homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SubscriptionThematicButton } from 'features/subscription/components/buttons/SubscriptionThematicButton'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { EmptyHeader } from 'ui/components/headers/EmptyHeader'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OnboardingSubscription = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabNavConfig('Home'))
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

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    () => {
      analytics.logSubscriptionUpdate({ type: 'update', from: 'home' })
      showSuccessSnackBar({
        message: 'Tes préférences ont bien été enregistrées.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      replace(...homeNavConfig)
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue, tu peux réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  )

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
      updateProfile({
        subscriptions: {
          marketingEmail: notifications.allowEmails,
          marketingPush: notifications.allowPush,
          subscribedThemes,
        },
      })
    },
    [subscribedThemes, updateProfile]
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

  const contentContainerStyle: ViewStyle = {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  }

  return (
    <React.Fragment>
      <EmptyHeader />
      <FlatList
        data={Object.values(SubscriptionTheme)}
        renderItem={renderItem}
        keyExtractor={(item) => mapSubscriptionThemeToName[item]}
        ListHeaderComponent={
          <React.Fragment>
            <StyledTitle3>Choisis des thèmes à suivre</StyledTitle3>
            <Spacer.Column numberOfSpaces={4} />
            <Typo.Body>
              Tu recevras des notifs et/ou des mails pour ne rien rater des dernières sorties et
              actus&nbsp;!
            </Typo.Body>
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        }
        contentContainerStyle={contentContainerStyle}
      />
      <StickyBottomWrapper>
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
      </StickyBottomWrapper>
      <NotificationsSettingsModal
        visible={isNotificationsModalVisible}
        title="Suivre la sélection"
        description="Pour recevoir toute l’actu de tes thèmes favoris, tu dois, au choix&nbsp;:"
        dismissModal={hideNotificationsModal}
        onPressSaveChanges={updateSubscription}
      />
    </React.Fragment>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const StyledView = styled.View.attrs({})(({ theme }) => ({
  backgroundColor: theme.colors.white,
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(3),
  paddingTop: getSpacing(4),
  gap: getSpacing(6),
}))

const SubscriptionThematicButtonContainer = styled.View({
  paddingVertical: getSpacing(2),
})
