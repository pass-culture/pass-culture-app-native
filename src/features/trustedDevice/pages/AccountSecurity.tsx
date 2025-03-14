import { useRoute } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { DeviceInformationsBanner } from 'features/trustedDevice/components/DeviceInformationsBanner'
import { formatTokenInfo } from 'features/trustedDevice/helpers/formatTokenInfo'
import { getTokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { analytics } from 'libs/analytics/provider'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, TypoDS } from 'ui/theme'

export const AccountSecurity = () => {
  const { params } = useRoute<UseRouteType<'AccountSecurity'>>()
  const { location, osAndSource, loginDate } = formatTokenInfo(getTokenInfo(params.token))
  const { user, isLoggedIn } = useAuthContext()

  const isLoggedOutOrHasPassword = !isLoggedIn || user?.hasPassword

  const onPressDismissAccountSecurity = () => {
    analytics.logDismissAccountSecurity()
    navigateToHome()
  }

  return (
    <GenericInfoPageWhite
      illustration={BicolorUserBlocked}
      title="Sécurise ton compte"
      buttonPrimary={
        isLoggedOutOrHasPassword
          ? {
              wording: 'Modifier mon mot de passe',
              navigateTo: {
                screen: 'ReinitializePassword',
                params: {
                  token: params.reset_password_token,
                  email: params.email,
                  expiration_timestamp: params.reset_token_expiration_timestamp,
                  from: 'suspiciouslogin',
                },
              },
            }
          : {
              wording: 'Suspendre mon compte',
              navigateTo: { screen: 'SuspensionChoice', params: { token: params.token } },
            }
      }
      buttonSecondary={
        isLoggedOutOrHasPassword
          ? {
              wording: 'Suspendre mon compte',
              navigateTo: { screen: 'SuspensionChoice', params: { token: params.token } },
            }
          : undefined
      }
      buttonTertiary={{
        icon: Invalidate,
        wording: 'Ne pas sécuriser mon compte',
        onPress: onPressDismissAccountSecurity,
      }}>
      <TypoDS.Body>
        Tu as indiqué <TypoDS.BodyAccent>ne pas être à l’origine</TypoDS.BodyAccent> de cette
        connexion&nbsp;:
      </TypoDS.Body>
      <Spacer.Column numberOfSpaces={4} />
      <DeviceInformationsBanner
        osAndSource={osAndSource}
        location={location}
        loginDate={loginDate}
      />
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>
        Pour des raisons de <TypoDS.BodyAccent>sécurité,</TypoDS.BodyAccent> nous te conseillons de
        {isLoggedOutOrHasPassword
          ? ' modifier ton mot de passe ou de suspendre ton compte temporairement.'
          : ' sécuriser l’accès à ta boîte mail et de suspendre ton compte pass Culture temporairement.'}
      </TypoDS.Body>
    </GenericInfoPageWhite>
  )
}
