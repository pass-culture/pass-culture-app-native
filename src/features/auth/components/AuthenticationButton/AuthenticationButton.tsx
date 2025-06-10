import React, { FC, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootNavigateParams, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ColorsType } from 'theme/types'
import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
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
  const isLogin = type === 'login'
  const nextNavigation: {
    screen: RootNavigateParams[0]
    params: RootStackParamList['SignupForm'] | RootStackParamList['Login']
  } = { screen: isLogin ? 'Login' : 'SignupForm', params }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const wording = isLogin ? 'Se connecter' : 'Créer un compte'
  const icon = isLogin ? Connect : ProfileFilled

  return (
    <AuthenticationContainer>
      <StyledBody>{text}</StyledBody>
      <InternalTouchableLink
        as={Button}
        navigateTo={nextNavigation}
        wording={wording}
        buttonColor={linkColor}
        icon={icon}
        onBeforeNavigate={onPress}
      />
    </AuthenticationContainer>
  )
}

const Button: FC<ButtonInsideTexteProps> = ({
  onPress,
  onLongPress,
  wording,
  icon,
  buttonColor,
  typography,
  accessibilityLabel,
  accessibilityRole,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || wording}>
      <ButtonInsideTextInner
        wording={wording}
        icon={icon}
        color={buttonColor}
        typography={typography}
        disablePadding
      />
    </TouchableOpacity>
  )
}

const AuthenticationContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: getSpacing(1),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
