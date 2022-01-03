import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PageNotFoundIcon } from 'ui/svg/icons/PageNotFoundIcon'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export const PageNotFound: React.FC = () => {
  return (
    <GenericInfoPage title={t`Page introuvable\u00a0!`} icon={PageNotFoundIcon}>
      <StyledBody>{t`Il est possible que cette page soit désactivée ou n'existe pas.`}</StyledBody>
      <Spacer.Column numberOfSpaces={12} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
