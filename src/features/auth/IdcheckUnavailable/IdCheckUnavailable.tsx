import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { openUrl } from 'features/navigation/helpers'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function IdCheckUnavailable() {
  const { goBack } = useGoBack(...homeNavConfig)
  const { data: settings } = useAppSettings()
  return (
    <GenericInfoPage
      title={t`Victime de notre succès !`}
      icon={({ color }) => <HappyFace size={getSpacing(30)} color={color} />}>
      <StyledBody>{t`Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre quelques difficultés.`}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      {!!settings?.displayDmsRedirection && (
        <React.Fragment>
          <StyledBody>{t`Tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées.
Nous reviendrons vers toi d’ici quelques jours.`}</StyledBody>
          <Spacer.Column numberOfSpaces={8} />
          <ButtonPrimaryWhite
            title={t`Transmettre un dossier`}
            onPress={() => openUrl(env.DSM_URL)}
            icon={ExternalLinkSite}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        title={t`Retourner à l'accueil`}
        onPress={goBack}
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
