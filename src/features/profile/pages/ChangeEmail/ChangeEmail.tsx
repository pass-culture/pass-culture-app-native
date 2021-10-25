import { t } from '@lingui/macro'
import { getSpacing } from '@pass-culture/id-check'
import React from 'react'
import styled from 'styled-components/native'

import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { ProfileContainer } from 'features/profile/components/reusables'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useSafeState } from 'libs/hooks'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { Spacer } from 'ui/theme'

export function ChangeEmail() {
  const [email, setEmail] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const disabled = !isLongEnough(password)

  // TODO (PC-11395) : Add correct function
  const submitEmailChange = () => 'submitEmailChange'

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={18} />
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <EmailInput label={t`Nouvel e-mail`} email={email} onEmailChange={setEmail} />
        <Spacer.Column numberOfSpaces={4} />
        <PasswordInput
          label={t`Mot de passe`}
          value={password}
          onChangeText={setPassword}
          placeholder={t`Ton mot de passe`}
          textContentType="password"
          {...accessibilityAndTestId('Entrée pour le mot de passe')}
        />
      </ProfileContainer>
      <ButtonContainer>
        <ButtonPrimary title={t`Enregistrer`} onPress={submitEmailChange} disabled={disabled} />
      </ButtonContainer>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}

const ButtonContainer = styled.View({
  flexDirection: 'row',
  alignSelf: 'flex-end',
  margin: getSpacing(5),
})
