import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootNavigateParams, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { Profile } from 'ui/svg/icons/Profile'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type LoginProps = {
  type: 'login'
  params?: RootStackParamList['Login']
}

type SignupProps = {
  type: 'signup'
  params?: RootStackParamList['SignupForm']
}

type Props = {
  linkColor?: ColorsEnum
  onAdditionalPress?: () => void
  children?: never
} & (LoginProps | SignupProps)

export const AuthenticationButton: FunctionComponent<Props> = ({
  type,
  linkColor,
  params = {},
  onAdditionalPress: onPress,
}) => {
  const isLogin = type === 'login'
  const nextNavigation: {
    screen: RootNavigateParams[0]
    params: RootStackParamList['SignupForm'] | RootStackParamList['Login']
  } = { screen: isLogin ? 'Login' : 'SignupForm', params }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const buttonWording = isLogin ? 'Se connecter' : 'Créer un compte'

  return (
    <AuthenticationContainer>
      <StyledBody>
        {text}
        <Spacer.Row numberOfSpaces={1} />
        <InternalTouchableLink
          as={ButtonInsideText}
          navigateTo={nextNavigation}
          wording={buttonWording}
          buttonColor={linkColor}
          icon={isLogin ? Connect : Profile}
          onBeforeNavigate={onPress}
        />
      </StyledBody>
    </AuthenticationContainer>
  )
}

const AuthenticationContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
