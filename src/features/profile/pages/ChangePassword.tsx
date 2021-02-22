import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { PasswordSecurityRules } from 'features/auth/components/PasswordSecurityRules'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'

export function ChangePassword() {
  const [password, setPassword] = useState('')

  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Mot de passe`)} />
      <Container>
        <StyledInput>
          <Typo.Body>{_(t`Mot de passe actuel`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            autoFocus={true}
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`F2A2b1E5`)}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={5} />
        <StyledInput>
          <Typo.Body>{_(t`Nouveau mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ex: mA2pass!`)}
          />
          <PasswordSecurityRules password={password} />
        </StyledInput>
        <Spacer.Column numberOfSpaces={5} />
        <StyledInput>
          <Typo.Body>{_(t`Confirmation nouveau mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ex: mA2pass!`)}
          />
        </StyledInput>
        <Spacer.Flex flex={1} />
        <ButtonPrimary title={_(t`Enregistrer`)} onPress={() => ({})} disabled={false} />
      </Container>
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

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  padding: getSpacing(4),
})
