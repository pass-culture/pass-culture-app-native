import React, { FunctionComponent } from 'react'

import { SSOButtonAppleBase } from 'features/auth/components/SSOButton/SSOButtonAppleBase'
import { SSOButtonGoogleBase } from 'features/auth/components/SSOButton/SSOButtonGoogleBase'
import { Provider, FormattedLastLoginInfo } from 'features/auth/types'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

type Props = {
  lastLoginInfo: FormattedLastLoginInfo | null
  params: RootStackParamList['LoginMethodsWithLastLoginInfo']
  enableAppleSSO: boolean
  onGoogleSuccess: (params: {
    authorizationCode: string
    oauthStateToken: string
    provider: Provider.GOOGLE
  }) => void
  onAppleSuccess: (params: {
    authorizationCode: string
    oauthStateToken: string
    provider: Provider.APPLE
  }) => void
}

export const ProviderButton: FunctionComponent<Props> = ({
  lastLoginInfo,
  params,
  enableAppleSSO,
  onGoogleSuccess,
  onAppleSuccess,
}) => {
  switch (lastLoginInfo?.provider.type) {
    case Provider.GOOGLE:
      return <SSOButtonGoogleBase type="login" onSuccess={onGoogleSuccess} />

    case Provider.APPLE:
      if (!enableAppleSSO) return null
      return <SSOButtonAppleBase type="login" onSuccess={onAppleSuccess} />

    case Provider.EMAIL:
      return (
        <InternalTouchableLink
          as={Button}
          variant="secondary"
          color="neutral"
          icon={EmailFilled}
          wording="Continuer avec mon e-mail"
          navigateTo={{ screen: 'Login', params }}
        />
      )

    default:
      return null
  }
}
