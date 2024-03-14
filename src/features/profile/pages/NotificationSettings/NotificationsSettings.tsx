import React, { useReducer } from 'react'
import { Linking, Platform } from 'react-native'
import { PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PushNotificationsModal } from 'features/notifications/pages/PushNotificationsModal'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SubscriptionTheme, TOTAL_NUMBER_OF_THEME } from 'features/subscription/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type State = {
  allowEmails?: boolean
  allowPush?: boolean
  themePreferences: SubscriptionTheme[]
}

export const NotificationsSettings = () => {
  const { isLoggedIn } = useAuthContext()

  const [state, dispatch] = useReducer(settingsReducer, {
    allowEmails: undefined,
    allowPush: undefined,
    themePreferences: [],
  })

  const updatePushPermissionFromSettings = (permission: PermissionStatus) => {
    if (permission === 'granted' && !state.allowPush) {
      dispatch('push')
    } else if (permission !== 'granted' && state.allowPush) dispatch('push')
  }

  const { pushPermission } = usePushPermission(updatePushPermissionFromSettings)

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
      dispatch('push')
    } else {
      showPushModal()
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
            toggle={() => dispatch('email')}
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
            toggle={() => dispatch('allTheme')}
            disabled={areThemeTogglesDisabled}
          />
          <Spacer.Column numberOfSpaces={2} />
          {Object.values(SubscriptionTheme).map((theme) => (
            <SectionWithSwitch
              key={theme}
              title={theme}
              active={isThemeToggled(theme)}
              disabled={areThemeTogglesDisabled}
              toggle={() => dispatch(theme)}
            />
          ))}
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            wording="Enregistrer"
            accessibilityLabel="Enregistrer les modifications"
            disabled={!isLoggedIn}
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

type ToggleActions = SubscriptionTheme | 'email' | 'push' | 'allTheme'

const settingsReducer = (state: State, toggle: ToggleActions) => {
  switch (toggle) {
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
    default:
      return {
        ...state,
        themePreferences: state.themePreferences.includes(toggle)
          ? state.themePreferences.filter((t) => t !== toggle)
          : [...state.themePreferences, toggle],
      }
  }
}
