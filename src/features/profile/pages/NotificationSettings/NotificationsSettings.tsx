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
import { hasUserChangedParameters } from 'features/profile/pages/NotificationSettings/helpers/hasUserChangedParameters'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { mapSubscriptionThemeToName } from 'features/subscription/mapSubscriptionThemeToName'
import { SubscriptionTheme, TOTAL_NUMBER_OF_THEME } from 'features/subscription/types'
import { analytics } from 'libs/analytics'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type NotificationsSettingsState = {
  allowEmails?: boolean
  allowPush?: boolean
  themePreferences: SubscriptionTheme[]
}

export const NotificationsSettings = () => {
  const { isLoggedIn, user } = useAuthContext()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const initialState = {
    allowEmails: user?.subscriptions.marketingEmail,
    allowPush: user?.subscriptions.marketingPush,
    themePreferences:
      (user?.subscriptions.subscribedThemes as unknown as SubscriptionTheme[]) || [],
  }

  const [state, dispatch] = useReducer(settingsReducer, initialState)

  const hasUserChanged = !!user && hasUserChangedParameters(user, state)

  const updatePushPermissionFromSettings = (permission: PermissionStatus) => {
    if (permission === 'granted' && !state.allowPush) {
      dispatch({ type: 'push' })
    } else if (permission !== 'granted' && state.allowPush) dispatch({ type: 'push' })
  }

  const { pushPermission } = usePushPermission(updatePushPermissionFromSettings)

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Paramètre enregistré',
      })
      analytics.logNotificationToggle(!!state.allowEmails, state.allowPush)

      goBack()
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
      })
      dispatch({ type: 'reset', initialState })
    }
  )

  const areNotificationsEnabled = state.allowEmails || state.allowPush

  const areThemeTogglesDisabled = !areNotificationsEnabled || !isLoggedIn

  const isThemeToggled = (theme: SubscriptionTheme) => {
    return areNotificationsEnabled && state.themePreferences.includes(theme)
  }

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
      dispatch({ type: 'push' })
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

  return (
    <SecondaryPageWithBlurHeader title="Suivi et notifications" scrollable>
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
          <SectionWithSwitch
            title="Autoriser l’envoi d’e-mails"
            active={state.allowEmails}
            toggle={() => dispatch({ type: 'email' })}
            disabled={!isLoggedIn}
          />
          {!state.allowEmails && isLoggedIn ? (
            <Typo.Caption>
              Tu continueras à recevoir par e-mail des informations essentielles concernant ton
              compte.
            </Typo.Caption>
          ) : null}
          {Platform.OS !== 'web' && (
            <SectionWithSwitch
              title="Autoriser les notifications"
              active={state.allowPush}
              toggle={togglePush}
              disabled={!isLoggedIn}
            />
          )}
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={8} />
          <Typo.Title4 {...getHeadingAttrs(2)}>Tes thème suivis</Typo.Title4>
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
          <SectionWithSwitch
            title="Suivre tous les thèmes"
            active={
              areNotificationsEnabled && state.themePreferences.length === TOTAL_NUMBER_OF_THEME
            }
            toggle={() => dispatch({ type: 'allTheme' })}
            disabled={areThemeTogglesDisabled}
          />
          <Spacer.Column numberOfSpaces={2} />
          {Object.values(SubscriptionTheme).map((theme) => (
            <SectionWithSwitch
              key={theme}
              title={mapSubscriptionThemeToName[theme]}
              active={isThemeToggled(theme)}
              disabled={areThemeTogglesDisabled}
              toggle={() => dispatch({ type: 'toggleTheme', theme })}
            />
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
      </Container>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
}))

type ToggleActionsBis =
  | { type: 'email' | 'push' | 'allTheme' }
  | { type: 'toggleTheme'; theme: SubscriptionTheme }
  | { type: 'reset'; initialState: NotificationsSettingsState }

const settingsReducer = (state: NotificationsSettingsState, action: ToggleActionsBis) => {
  switch (action.type) {
    case 'email':
      return {
        ...state,
        allowEmails: !state.allowEmails,
      }
    case 'push':
      return {
        ...state,
        allowPush: !state.allowPush,
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
