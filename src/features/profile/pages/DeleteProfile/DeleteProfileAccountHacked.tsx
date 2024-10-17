import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Clear } from 'ui/svg/icons/Clear'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { TypoDS } from 'ui/theme'

export const DeleteProfileAccountHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const navigateToSuspendAccount = () => {
    navigate('SuspendAccountConfirmationWithoutAuthentication')
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
          <TypoDS.Body>
            Tu as indiqué
            <TypoDS.BodyAccent> que quelqu’un d’autre a accès à ton compte.</TypoDS.BodyAccent>
          </TypoDS.Body>
          <TypoDS.Body>
            Pour des raisons de <TypoDS.BodyAccent>sécurité</TypoDS.BodyAccent>, nous te conseillons
            de suspendre ton compte temporairement.
          </TypoDS.Body>
        </ViewGap>
        <ContentBottom>
          <ButtonPrimary wording="Suspendre mon compte" onPress={navigateToSuspendAccount} />
          <ButtonTertiaryBlack
            wording="Ne pas sécuriser mon compte"
            onPress={navigateToProfile}
            icon={Clear}
            inline
          />
          <StyledBody>
            Tu recevras un e-mail pour t’indiquer les étapes à suivre pour récupérer ton compte
          </StyledBody>
        </ContentBottom>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}

const ContentBottom = styled(ViewGap).attrs({
  gap: 6,
})({
  alignItems: 'center',
})

const StyledBody = styled(TypoDS.BodyS)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
