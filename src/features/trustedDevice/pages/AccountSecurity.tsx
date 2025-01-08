import { useRoute } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { DeviceInformationsBanner } from 'features/trustedDevice/components/DeviceInformationsBanner'
import { formatTokenInfo } from 'features/trustedDevice/helpers/formatTokenInfo'
import { getTokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo, TypoDS } from 'ui/theme'

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
      title="Sécurise ton compte"
      titleComponent={TypoDS.Title3}
      icon={BicolorUserBlocked}
      separateIconFromTitle={false}>
      <TypoDS.Body>
        Tu as indiqué <Typo.ButtonText>ne pas être à l’origine</Typo.ButtonText> de cette
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
        Pour des raisons de <Typo.ButtonText>sécurité,</Typo.ButtonText> nous te conseillons de
        {isLoggedOutOrHasPassword
          ? ' modifier ton mot de passe ou de suspendre ton compte temporairement.'
          : ' sécuriser l’accès à ta boîte mail et de suspendre ton compte pass Culture temporairement.'}
      </TypoDS.Body>
      {isLoggedOutOrHasPassword ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <InternalTouchableLink
            wording="Modifier mon mot de passe"
            navigateTo={{
              screen: 'ReinitializePassword',
              params: {
                token: params.reset_password_token,
                email: params.email,
                expiration_timestamp: params.reset_token_expiration_timestamp,
                from: 'suspiciouslogin',
              },
            }}
            as={isLoggedOutOrHasPassword ? ButtonPrimary : ButtonSecondary}
          />
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        wording="Suspendre mon compte"
        navigateTo={{ screen: 'SuspensionChoice', params: { token: params.token } }}
        as={isLoggedOutOrHasPassword ? ButtonSecondary : ButtonPrimary}
      />
      <Spacer.Column numberOfSpaces={2} />
      <TouchableLink
        as={ButtonTertiaryBlack}
        wording="Ne pas sécuriser mon compte"
        icon={Invalidate}
        handleNavigation={onPressDismissAccountSecurity}
      />
    </GenericInfoPageWhite>
  )
}
