import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Clear } from 'ui/svg/icons/Clear'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { TypoDS } from 'ui/theme'

export const DeleteProfileAccountHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const navigateToChangePassword = () => navigate('ChangePassword')

  const navigateToSuspendAccount = () => {
    navigate('SuspendAccountConfirmationNoToken')
  }

  return (
    <GenericInfoPageWhite
      headerGoBack
      separateIconFromTitle={false}
      icon={BicolorUserBlocked}
      titleComponent={TypoDS.Title2}
      title="Sécurise ton compte">
      <ViewGap gap={8}>
        <ViewGap gap={6}>
          <TypoDS.BodyS>
            Tu as indiqué
            <StyledBoldText> que quelqu’un d’autre a accès à ton compte</StyledBoldText>.
          </TypoDS.BodyS>
          <TypoDS.BodyS>
            Pour des raisons de <StyledBoldText>sécurité</StyledBoldText>, nous te conseillons de
            modifier ton mot de passe ou suspendre ton compte temporairement.
          </TypoDS.BodyS>
        </ViewGap>

        <ContentBottom>
          <ButtonPrimary wording="Modifier mon mot de passe" onPress={navigateToChangePassword} />
          <ButtonSecondary wording="Suspendre mon compte" onPress={navigateToSuspendAccount} />
          <ButtonTertiaryBlack
            wording="Ne pas sécuriser mon compte"
            onPress={navigateToProfile}
            icon={Clear}
          />
        </ContentBottom>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}

const StyledBoldText = styled(TypoDS.BodyS)({
  fontWeight: 'bold',
})

const ContentBottom = styled(ViewGap).attrs({
  gap: 6,
})({
  alignItems: 'center',
})
