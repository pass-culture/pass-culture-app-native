import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { GenericErrorPage } from 'ui/components/GenericErrorPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'

export const NoContentError = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearchTab = () => {
    navigate(...getTabNavConfig('Search'))
  }

  return (
    <GenericErrorPage
      title={t`Oups\u00a0!`}
      icon={BrokenConnection}
      buttons={[
        <SearchButton
          key={1}
          wording={t`Rechercher une offre`}
          icon={MagnifyingGlass}
          onPress={navigateToSearchTab}
          buttonHeight="tall"
        />,
      ]}>
      <BodyText>{t`Une erreur s’est produite pendant le chargement de nos recommandations.`}</BodyText>
    </GenericErrorPage>
  )
}

const BodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const SearchButton = styled(ButtonSecondaryWhite).attrs({
  iconSize: 22,
})({
  width: 'auto',
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
})
