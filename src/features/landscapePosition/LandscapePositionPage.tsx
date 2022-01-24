import { t } from '@lingui/macro'
import React from 'react'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PhoneFlip } from 'ui/svg/icons/PhoneFlip'
import { Typo } from 'ui/theme'

type LandscapePositionPageProps = {
  isVisible: boolean
}

export const LandscapePositionPage: React.FC<LandscapePositionPageProps> = ({ isVisible }) => {
  return (
    <StyledModal isVisible={isVisible}>
      <Helmet>
        <title>{t`Tourne-moi`}</title>
      </Helmet>
      <GenericInfoPage title={t`Tourne-moi`} icon={PhoneFlip}>
        <StyledBody>
          {t`Place ton téléphone ou ta tablette à la verticale pour afficher l’application.`}
        </StyledBody>
      </GenericInfoPage>
    </StyledModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

// @ts-ignore Argument of type 'typeof ReactNativeModal' is not assignable to parameter of type 'Any<StyledComponent>'
const StyledModal = styled(ReactNativeModal)({
  margin: 0.5,
})
