import { useRoute } from '@react-navigation/native'
import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { DeviceInformationsBanner } from 'features/trustedDevice/components/DeviceInformationsBanner'
import { formatTokenInfo } from 'features/trustedDevice/helpers/formatTokenInfo'
import { getTokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export const AccountSecurity = () => {
  const { params } = useRoute<UseRouteType<'AccountSecurity'>>()
  const { location, osAndSource, loginDate } = formatTokenInfo(getTokenInfo(params.token))

  return (
    <GenericInfoPageWhite
      title="Sécurise ton compte"
      titleComponent={Typo.Title3}
      icon={BicolorUserBlocked}
      separateIconFromTitle={false}>
      <Typo.Body>
        Tu as indiqué <Typo.ButtonText>ne pas être à l’origine</Typo.ButtonText> de cette
        connexion&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <DeviceInformationsBanner
        osAndSource={osAndSource}
        location={location}
        loginDate={loginDate}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        Pour des raisons de <Typo.ButtonText>sécurité,</Typo.ButtonText> nous te conseillons de
        modifier ton mot de passe ou de suspendre ton compte temporairement.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <InternalTouchableLink
        wording="Modifier mon mot de passe"
        navigateTo={{
          screen: 'ReinitializePassword',
          params: {
            token: params.reset_password_token,
            email: params.email,
            expiration_timestamp: params.reset_token_expiration_timestamp,
          },
        }}
        as={ButtonPrimary}
      />
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        wording="Suspendre mon compte"
        navigateTo={{ screen: 'SuspensionChoice', params: { token: params.token } }}
        as={ButtonSecondary}
      />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonTertiaryBlack
        wording="Ne pas sécuriser mon compte"
        icon={Invalidate}
        onPress={navigateToHome}
      />
    </GenericInfoPageWhite>
  )
}
