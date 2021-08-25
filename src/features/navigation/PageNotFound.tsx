import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PageNotFoundIcon } from 'ui/svg/icons/PageNotFoundIcon'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

export const PageNotFound: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Page introuvable | Pass Culture`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage
        title={t`Page introuvable !`}
        icon={PageNotFoundIcon}
        iconSize={getSpacing(40)}>
        <StyledBody>{t`Il est possible que cette page soit désactivée ou n'existe pas.`}</StyledBody>
        <Spacer.Column numberOfSpaces={12} />
        <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
