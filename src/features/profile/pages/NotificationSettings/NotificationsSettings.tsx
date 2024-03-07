import React, { useCallback, useState } from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type State = {
  allowEmails: boolean | undefined
  allowPush: boolean | undefined
}

export const NotificationsSettings = () => {
  const { isLoggedIn } = useAuthContext()

  const [state, setState] = useState<State>({
    allowEmails: undefined,
    allowPush: undefined,
  })

  const toggleEmails = useCallback(() => {
    if (!isLoggedIn) return
    setState((prevState) => ({
      ...prevState,
      allowEmails: !prevState.allowEmails,
    }))
  }, [isLoggedIn])

  const togglePush = useCallback(() => {
    if (!isLoggedIn) return
    setState((prevState) => {
      return {
        ...prevState,
        allowPush: !prevState.allowPush,
      }
    })
  }, [isLoggedIn])

  return (
    <PageProfileSection title="Suivi et notifications">
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
          toggle={toggleEmails}
          disabled={!isLoggedIn}
        />
        {!(Platform.OS === 'web') && (
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
        <ButtonPrimary wording="Enregistrer" accessibilityLabel="Enregistrer les modifications" />
      </Form.Flex>
    </PageProfileSection>
  )
}
