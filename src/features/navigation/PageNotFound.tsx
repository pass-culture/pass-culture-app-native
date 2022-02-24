import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PageNotFound as PageNotFoundIcon } from 'ui/svg/icons/PageNotFound'
import { Typo } from 'ui/theme'

export const PageNotFound: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Page introuvable` + ' | pass Culture'}</title>
      </Helmet>
      <GenericInfoPage
        title={t`Page introuvable\u00a0!`}
        icon={PageNotFoundIcon}
        buttons={[
          <ButtonPrimaryWhite
            key={1}
            wording={t`Retourner à l'accueil`}
            onPress={navigateToHome}
          />,
        ]}>
        <StyledBody>{t`Il est possible que cette page soit désactivée ou n'existe pas.`}</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
