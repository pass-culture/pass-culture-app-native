import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { GenericErrorPage } from 'ui/components/GenericErrorPage'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { Typo } from 'ui/theme'

export const NoContentError = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearchTab = () => {
    navigate(...getTabNavConfig('Search'))
  }

  const helmetTitle =
    'Page erreur\u00a0: Erreur pendant le chargement de nos recommandations | pass Culture'

  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericErrorPage
        title="Oups&nbsp;!"
        icon={BrokenConnection}
        buttons={[
          <ButtonSecondaryWhite
            key={1}
            wording="Rechercher une offre"
            icon={MagnifyingGlass}
            onPress={navigateToSearchTab}
            buttonHeight="tall"
          />,
        ]}>
        <StyledBody>
          Une erreur s’est produite pendant le chargement de nos recommandations.
        </StyledBody>
      </GenericErrorPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const BrokenConnection = styled(BicolorBrokenConnection).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``
