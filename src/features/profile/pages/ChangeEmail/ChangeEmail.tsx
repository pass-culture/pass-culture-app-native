import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ProfileContainer } from 'features/profile/components/reusables'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useSafeState } from 'libs/hooks'
import { accessibilityAndTestId } from 'tests/utils'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { getSpacing, Spacer } from 'ui/theme'

export function ChangeEmail() {
  const [password, setPassword] = useSafeState('')

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={18} />
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <StyledInput>
          <PasswordInput
            label={t`Mot de passe`}
            value={password}
            onChangeText={setPassword}
            placeholder={t`Ton mot de passe`}
            textContentType="password"
            {...accessibilityAndTestId('Entrée pour le mot de passe')}
          />
        </StyledInput>
      </ProfileContainer>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
