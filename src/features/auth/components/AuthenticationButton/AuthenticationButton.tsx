import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  RootNavigateParams,
  RootStackParamList,
} from 'features/navigation/navigators/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Link } from 'ui/designSystem/Link/Link'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

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
    params: RootStackParamList['SignupForm'] | RootStackParamList['LoginMethods']
  } = { screen: isLogin ? 'LoginMethods' : 'SignupForm', params }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const wording = isLogin ? 'Se connecter' : 'Créer un compte'

  return (
    <StyledBody>
      {text}
      {SPACE}
      <InternalTouchableLink
        as={Link}
        isInsideText
        navigateTo={nextNavigation}
        wording={wording}
        textColor={linkColor}
        onBeforeNavigate={onPress}
        accessibilityRole={AccessibilityRole.BUTTON}
      />
    </StyledBody>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
