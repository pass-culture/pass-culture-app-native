import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import {
  RootNavigateParams,
  RootStackParamList,
} from 'features/navigation/navigators/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Link } from 'ui/designSystem/Link/Link'
import { TextWithLink } from 'ui/designSystem/TextWithLink/TextWithLink'
import { Connect } from 'ui/svg/icons/Connect'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'

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
    params: RootStackParamList['SignupForm'] | RootStackParamList['LoginMethods']
  } = { screen: isLogin ? 'LoginMethods' : 'SignupForm', params }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const wording = isLogin ? 'Se connecter' : 'Créer un compte'
  const color = linkColor ?? designSystem.color.icon.brandPrimary

  return (
    <AuthenticationTextWithLink
      beforeText={text}
      linkLabel={wording}
      icon={isLogin ? Connect : ProfileFilled}
      textColor={color}
      renderLink={(linkProps) => (
        <InternalTouchableLink
          as={Link}
          navigateTo={nextNavigation}
          onBeforeNavigate={onPress}
          accessibilityRole={AccessibilityRole.BUTTON}
          {...linkProps}
        />
      )}
    />
  )
}

const AuthenticationTextWithLink = styled(TextWithLink)({
  justifyContent: 'center',
})
