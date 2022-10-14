import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface Props {
  linkColor?: ColorsEnum
  children?: never
}

export const LogInButton: FunctionComponent<Props> = ({ linkColor: color }) => {
  return (
    <LoginContainer>
      <StyledBody>
        Déjà un compte&nbsp;?
        <Spacer.Row numberOfSpaces={1} />
        <TouchableLink
          as={ButtonInsideText}
          navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
          wording="Se connecter"
          icon={Connect}
          color={color}
        />
      </StyledBody>
    </LoginContainer>
  )
}

const LoginContainer = styled.View({
  justifyContent: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
