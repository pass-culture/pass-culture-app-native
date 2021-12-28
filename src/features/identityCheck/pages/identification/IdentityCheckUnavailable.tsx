import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome, openUrl } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function IdentityCheckUnavailable() {
  const { params } = useRoute<UseRouteType<'IdentityCheckUnavailable'>>()
  return (
    <GenericInfoPage
      title={t`Victime de notre succès\u00a0!`}
      icon={({ color }) => <HappyFace size={getSpacing(30)} color={color} />}>
      <StyledBody>{t`Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre quelques difficultés.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Nous reviendrons vers toi dès que le service sera rétabli.`}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      {!!params?.withDMS && (
        <React.Fragment>
          <StyledBody>{t`Tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées.
Nous reviendrons vers toi d’ici quelques jours.`}</StyledBody>
          <Spacer.Column numberOfSpaces={8} />
          <ButtonPrimaryWhite
            title={t`Transmettre un dossier`}
            onPress={() => openUrl(env.DSM_URL)}
            iconSize={20}
            icon={ExternalSite}
          />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <ButtonTertiaryWhite
        title={t`Retourner à l'accueil`}
        onPress={navigateToHome}
        icon={PlainArrowPrevious}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
