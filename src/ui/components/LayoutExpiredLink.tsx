import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome, openUrl } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type Props = {
  urlFAQ?: string
  resetQuery: () => void
  isFetching: boolean
}

export function LayoutExpiredLink({ isFetching, urlFAQ, resetQuery }: Props) {
  return (
    <GenericInfoPage title={t`Oups !`} icon={SadFace}>
      <StyledBody>{t`Le lien est expiré !`}</StyledBody>
      <StyledBody>{t`Clique sur « Renvoyer l’e-mail » pour recevoir un nouveau lien.`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      {!!urlFAQ && (
        <React.Fragment>
          <StyledBody>{t`Si tu as besoin d’aide n’hésite pas à :`}</StyledBody>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryWhite
            title={t`Consulter l'article d'aide`}
            onPress={() => openUrl(urlFAQ)}
            icon={ExternalSite}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite title={t`Renvoyer l'email`} onPress={resetQuery} disabled={isFetching} />
      <Spacer.Column numberOfSpaces={2} />
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
