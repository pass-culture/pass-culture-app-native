import React, { useReducer } from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { SubscriptionTheme, TOTAL_NUMBER_OF_THEME } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type State = {
  allowEmails: boolean | undefined
  allowPush: boolean | undefined
  themePreferences: SubscriptionTheme[]
}

export const NotificationsSettings = () => {
  const { isLoggedIn } = useAuthContext()

  const [state, dispatch] = useReducer(settingsReducer, {
    allowEmails: undefined,
    allowPush: undefined,
    themePreferences: [],
  })

  const isThemeToggled = (theme: SubscriptionTheme) => {
    return state.themePreferences.includes(theme)
  }

  return (
    <PageProfileSection title="Suivi et notifications" scrollable>
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
        {!(Platform.OS === 'web') && (
          <SectionWithSwitch
            title="Autoriser les notifications"
            active={state.allowPush}
            toggle={() => dispatch('push')}
            disabled={!isLoggedIn}
          />
        )}
        <Spacer.Column numberOfSpaces={4} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={8} />
        <Typo.Title4 {...getHeadingAttrs(2)}>Tes thème suivis</Typo.Title4>
        <Spacer.Column numberOfSpaces={6} />
        <SectionWithSwitch
          title="Suivre tous les thèmes"
          active={state.themePreferences.length === TOTAL_NUMBER_OF_THEME}
          toggle={() => dispatch('allTheme')}
          disabled={!isLoggedIn}
        />
        <Spacer.Column numberOfSpaces={2} />
        {Object.values(SubscriptionTheme).map((theme) => (
          <React.Fragment key={theme}>
            <SectionWithSwitch
              title={theme}
              active={isThemeToggled(theme)}
              disabled={!isLoggedIn}
              toggle={() => dispatch(theme)}
            />
          </React.Fragment>
        ))}
        <Spacer.Column numberOfSpaces={2} />
        <ButtonPrimary wording="Enregistrer" accessibilityLabel="Enregistrer les modifications" />
      </Form.Flex>
    </PageProfileSection>
  )
}

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
