import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { formatTokenInfo } from 'features/trustedDevice/helpers/formatTokenInfo'
import { getTokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InfoBanner } from 'ui/components/InfoBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Info } from 'ui/svg/icons/Info'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export const AccountSecurity = () => {
  return (
    <GenericInfoPageWhite
      title="Sécurise ton compte"
      titleComponent={Typo.Title3}
      icon={BicolorUserBlocked}
      separateIconFromTitle={false}>
      <Typo.Body>
        Tu as indiqué <Typo.ButtonText>ne pas être à l&apos;origine</Typo.ButtonText> de cette
        connexion&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <InfoBanner message={<DeviceInformations />} icon={Info} />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        Pour des raisons de <Typo.ButtonText>sécurité,</Typo.ButtonText> nous te conseillons de
        modifier ton mot de passe ou de suspendre ton compte temporairement.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <InternalTouchableLink
        wording="Modifier mon mot de passe"
        navigateTo={{ screen: 'ChangePassword' }}
        as={ButtonPrimary}
      />
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        wording="Suspendre mon compte"
        navigateTo={{ screen: 'SuspensionChoice' }}
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

const DeviceInformations = () => {
  const { params } = useRoute<UseRouteType<'AccountSecurity'>>()
  const { location, osAndSource, loginDate } = formatTokenInfo(getTokenInfo(params.token))

  return (
    <CaptionRegular>
      <Typo.Caption>Appareil utilisé&nbsp;: </Typo.Caption> {osAndSource}
      {LINE_BREAK}
      <Typo.Caption>Lieu&nbsp;: </Typo.Caption> {location}
      {LINE_BREAK}
      <Typo.Caption>Date et heure&nbsp;: </Typo.Caption> {loginDate}
    </CaptionRegular>
  )
}

const CaptionRegular = styled(Typo.Caption)(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
}))
