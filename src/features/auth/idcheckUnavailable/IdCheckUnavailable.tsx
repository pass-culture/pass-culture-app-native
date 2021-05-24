import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function IdCheckUnavailable() {
  const { goBack, canGoBack } = useNavigation<UseNavigationType>()

  async function goToPreviousPage() {
    if (canGoBack()) {
      goBack()
    }
  }

  return (
    <GenericInfoPage
      title={t`Victime de notre succès`}
      icon={({ color }) => <HappyFaceStars size={220} color={color} />}>
      <StyledBody>{t`Vous êtes actuellement très nombreux à demander les 300€ et notre service rencontre quelques difficultés.`}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>{t`Cependant, tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées, et on reviendra vers toi d'ici quelques jours au plus tard :`}</StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite
        title={t`Transmettre un dossier`}
        onPress={() => openExternalUrl(env.DSM_URL)}
        icon={ExternalLinkSite}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retour`} onPress={goToPreviousPage} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
