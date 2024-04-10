import React, { useReducer } from 'react'
import { Linking, Platform } from 'react-native'
import { PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { PushNotificationsModal } from 'features/notifications/pages/PushNotificationsModal'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { UnsavedSettingsModal } from 'features/profile/pages/NotificationSettings/components/UnsavedSettingsModal'
import { hasUserChangedParameters } from 'features/profile/pages/NotificationSettings/helpers/hasUserChangedParameters'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme, TOTAL_NUMBER_OF_THEME } from 'features/subscription/types'
import { analytics } from 'libs/analytics'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type NotificationsSettingsState = {
  allowEmails?: boolean
  allowPush?: boolean
  themePreferences: SubscriptionTheme[]
}

export const NotificationsSettings = () => {
  const { isLoggedIn, user } = useAuthContext()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const initialState = user?.subscriptions
    ? {
        allowEmails: user?.subscriptions.marketingEmail,
        allowPush: user?.subscriptions.marketingPush,
        themePreferences:
          (user?.subscriptions.subscribedThemes as unknown as SubscriptionTheme[]) || [],
      }
    : { allowEmails: false, allowPush: false, themePreferences: [] }

  const [state, dispatch] = useReducer(settingsReducer, initialState)

  const hasUserChanged = !!user?.subscriptions && hasUserChangedParameters(user, state)

  const updatePushPermissionFromSettings = (permission: PermissionStatus) => {
    if (permission === 'granted' && user?.subscriptions.marketingPush) {
      dispatch({ type: 'push', state: true })
    } else dispatch({ type: 'push', state: false })
  }

  const { pushPermission } = usePushPermission(updatePushPermissionFromSettings)

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Tes modifications ont été enregistrées\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
      analytics.logNotificationToggle(!!state.allowEmails, state.allowPush)
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
      dispatch({ type: 'reset', initialState })
    }
  )

  const areNotificationsEnabled =
    Platform.OS === 'web' ? state.allowEmails : state.allowEmails || state.allowPush

  const areThemeTogglesDisabled = !areNotificationsEnabled || !isLoggedIn

  const isThemeToggled = (theme: SubscriptionTheme) => {
    return areNotificationsEnabled && state.themePreferences.includes(theme)
  }

  const {
    visible: isUnsavedModalVisible,
    showModal: showUnsavedModal,
    hideModal: hideUnsavedModal,
  } = useModal(false)

  const {
    visible: isPushModalVisible,
    showModal: showPushModal,
    hideModal: hidePushModal,
  } = useModal(false)

  const onRequestNotificationPermissionFromModal = () => {
    hidePushModal()
    Linking.openSettings()
  }

  const togglePush = () => {
    if (pushPermission === 'granted') {
      dispatch({ type: 'push', state: 'toggle' })
    } else {
      showPushModal()
    }
  }

  const isSaveButtonDisabled = !isLoggedIn || !hasUserChanged || isUpdatingProfile

  const submitProfile = () => {
    if (state.allowEmails !== undefined && state.allowPush !== undefined) {
      updateProfile({
        subscriptions: {
          marketingEmail: state.allowEmails,
          marketingPush: state.allowPush,
          subscribedThemes: state.themePreferences,
        },
      })
    }
  }

  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <SecondaryPageWithBlurHeader
      title="Suivi et notifications"
      scrollable
      onGoBack={() => {
        if (hasUserChanged) {
          showUnsavedModal()
        } else {
          goBack()
        }
      }}>
      <Container>
        {isLoggedIn ? null : (
          <React.Fragment>
            <InfoBanner
              message="Tu dois être connecté pour activer les notifications et rester informé des bons plans sur le pass Culture."
              icon={Info}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        )}
        <Typo.Title4 {...getHeadingAttrs(2)}>Type d’alerte</Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        <Typo.Body>
          Reste informé des actualités du pass Culture et ne rate aucun de nos bons plans.
        </Typo.Body>
        <Spacer.Column numberOfSpaces={2} />
        <Form.Flex>
          <SectionWithSwitchContainer>
            <SectionWithSwitch
              title="Autoriser l’envoi d’e-mails"
              active={isLoggedIn && state.allowEmails}
              toggle={() => dispatch({ type: 'email' })}
              disabled={!isLoggedIn}
            />
          </SectionWithSwitchContainer>
          {!state.allowEmails && isLoggedIn ? (
            <Typo.Caption>
              Tu continueras à recevoir par e-mail des informations essentielles concernant ton
              compte.
            </Typo.Caption>
          ) : null}
          {Platform.OS !== 'web' && (
            <SectionWithSwitchContainer>
              <SectionWithSwitch
                title="Autoriser les notifications"
                active={isLoggedIn && state.allowPush}
                toggle={togglePush}
                disabled={!isLoggedIn}
              />
            </SectionWithSwitchContainer>
          )}
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={8} />
          <Typo.Title4 {...getHeadingAttrs(2)}>Tes thèmes suivis</Typo.Title4>
          {!isLoggedIn || areNotificationsEnabled ? null : (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <InfoBanner
                message="Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications."
                icon={Info}
              />
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={6} />
          <SectionWithSwitchContainer>
            <SectionWithSwitch
              title="Suivre tous les thèmes"
              active={
                areNotificationsEnabled && state.themePreferences.length === TOTAL_NUMBER_OF_THEME
              }
              toggle={() => dispatch({ type: 'allTheme' })}
              disabled={areThemeTogglesDisabled}
            />
          </SectionWithSwitchContainer>
          <Spacer.Column numberOfSpaces={2} />
          {Object.values(SubscriptionTheme).map((theme) => (
            <SectionWithSwitchContainer key={theme}>
              <SectionWithSwitch
                title={mapSubscriptionThemeToName[theme]}
                active={isThemeToggled(theme)}
                disabled={areThemeTogglesDisabled}
                toggle={() => dispatch({ type: 'toggleTheme', theme })}
              />
            </SectionWithSwitchContainer>
          ))}
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            wording="Enregistrer"
            accessibilityLabel="Enregistrer les modifications"
            onPress={submitProfile}
            disabled={isSaveButtonDisabled}
          />
        </Form.Flex>
        <PushNotificationsModal
          visible={isPushModalVisible}
          onRequestPermission={onRequestNotificationPermissionFromModal}
          onDismiss={hidePushModal}
        />
        <UnsavedSettingsModal
          visible={isUnsavedModalVisible}
          dismissModal={hideUnsavedModal}
          onPressSaveChanges={submitProfile}
        />
      </Container>
    </SecondaryPageWithBlurHeader>
  )
}

const SectionWithSwitchContainer = styled.View({
  paddingVertical: getSpacing(4),
})

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
}))

type ToggleActions =
  | { type: 'email' | 'allTheme' }
  | { type: 'push'; state: 'toggle' | boolean }
  | { type: 'toggleTheme'; theme: SubscriptionTheme }
  | { type: 'reset'; initialState: NotificationsSettingsState }

const settingsReducer = (state: NotificationsSettingsState, action: ToggleActions) => {
  switch (action.type) {
    case 'email':
      return {
        ...state,
        allowEmails: !state.allowEmails,
      }
    case 'push':
      if (action.state === 'toggle') return { ...state, allowPush: !state.allowPush }
      else
        return {
          ...state,
          allowPush: action.state,
        }
    case 'allTheme':
      return {
        ...state,
        themePreferences:
          state.themePreferences.length === TOTAL_NUMBER_OF_THEME
            ? []
            : Object.values(SubscriptionTheme),
      }
    case 'toggleTheme':
      return {
        ...state,
        themePreferences: state.themePreferences.includes(action.theme)
          ? state.themePreferences.filter((t) => t !== action.theme)
          : [...state.themePreferences, action.theme],
      }
    case 'reset':
      return action.initialState
    default:
      return state
  }
}
