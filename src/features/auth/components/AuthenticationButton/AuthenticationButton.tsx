import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { RootNavigateParams, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'
import { getSpacing, Typo } from 'ui/theme'

type LoginProps = {
  type: 'login'
  params?: RootStackParamList['Login']
}

type SignupProps = {
  type: 'signup'
  params?: RootStackParamList['SignupForm']
}

type Props = {
  linkColor?: ColorsType
  onAdditionalPress?: () => void
  children?: never
} & (LoginProps | SignupProps)

export const AuthenticationButton: FunctionComponent<Props> = ({
  type,
  linkColor,
  params = {},
  onAdditionalPress: onPress,
}) => {
  const { designSystem } = useTheme()
  const isLogin = type === 'login'
  const nextNavigation: {
    screen: RootNavigateParams[0]
    params: RootStackParamList['SignupForm'] | RootStackParamList['Login']
  } = { screen: isLogin ? 'Login' : 'SignupForm', params }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const wording = isLogin ? 'Se connecter' : 'Créer un compte'
  const color = linkColor ?? designSystem.color.icon.brandPrimary

  return (
    <AuthenticationContainer>
      <StyledBody>{text}</StyledBody>
      <ButtonContainer>
        {isLogin ? <Connect color={color} /> : <ProfileFilled color={color} />}
        <InternalTouchableLink
          as={LinkInsideText}
          navigateTo={nextNavigation}
          wording={wording}
          color={color}
          onBeforeNavigate={onPress}
          accessibilityRole={AccessibilityRole.BUTTON}
        />
      </ButtonContainer>
    </AuthenticationContainer>
  )
}

const ButtonContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(1),
})

const AuthenticationContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: getSpacing(1),
  flexWrap: 'wrap',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
