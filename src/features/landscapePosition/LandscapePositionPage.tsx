import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PhoneError } from 'ui/svg/PhoneError'
import { Spacer, Typo } from 'ui/theme'

export const LandscapePositionPage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Tourne-moi`}</title>
      </Helmet>
      <GenericInfoPage title={t`Tourne-moi`} icon={PhoneError}>
        <Spacer.Column numberOfSpaces={6} />
        <StyledBody>
          {t`Place ton téléphone ou ta tablette à la verticale pour afficher l’application.`}
        </StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
