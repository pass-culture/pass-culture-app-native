import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import {
  RootNavigateParams,
  RootStackParamList,
} from 'features/navigation/navigators/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Link } from 'ui/designSystem/Link/Link'
import { Typo } from 'ui/theme'

type LoginProps = {
  type: 'login'
  params?: RootStackParamList['Login']
}

type SignupProps = {
  type: 'signup'
  params?: RootStackParamList['SignupMethods']
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
  const enabledSaveLastLoginInfo = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_SAVE_LAST_LOGIN_INFO
  )
  const [hasLastLoginInfo, setHasLastLoginInfo] = useState(false)

  const isLogin = type === 'login'

  useEffect(() => {
    if (!isLogin || !enabledSaveLastLoginInfo) return
    const loadLastLoginInfo = async () => {
      const lastLoginInfo = await getLastLoginInfo()
      setHasLastLoginInfo(lastLoginInfo !== null)
    }
    void loadLastLoginInfo()
  }, [isLogin, enabledSaveLastLoginInfo])

  const loginScreen: RootNavigateParams[0] = hasLastLoginInfo
    ? 'LoginMethodsWithLastLoginInfo'
    : 'LoginMethods'

  const nextNavigation: {
    screen: RootNavigateParams[0]
    params:
      | RootStackParamList['SignupMethods']
      | RootStackParamList['LoginMethods']
      | RootStackParamList['LoginMethodsWithLastLoginInfo']
  } = {
    screen: isLogin ? loginScreen : 'SignupMethods',
    params,
  }

  const text = isLogin ? 'Déjà un compte\u00a0?' : 'Pas de compte\u00a0?'
  const wording = isLogin ? 'Se connecter' : 'Créer un compte'

  return (
    <AuthenticationContainer>
      <StyledBody>{text}</StyledBody>
      <InternalTouchableLink
        as={Link}
        navigateTo={nextNavigation}
        label={wording}
        textColor={linkColor}
        onBeforeNavigate={onPress}
        accessibilityRole={AccessibilityRole.BUTTON}
      />
    </AuthenticationContainer>
  )
}

const AuthenticationContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.designSystem.size.spacing.xs,
  justifyContent: 'center',
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
