import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export const CheatcodesScreenGenericInfoPage = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToCheatcodesNavigationGenericPages = () => {
    navigate('CheatcodesStackNavigator', { screen: 'CheatcodesNavigationGenericPages' })
  }
  return (
    <GenericInfoPage
      withGoBack
      withSkipAction={navigateToCheatcodesNavigationGenericPages}
      illustration={MaintenanceCone}
      title="Un titre qui devrait passer sur deux lignes si besoin"
      subtitle="Un sous-titre qui devrait passer sur deux lignes si besoin"
      buttonsSurtitle={<StyledBodyXs>Attention&nbsp;: ceci est un surtitre de bouton</StyledBodyXs>}
      buttonPrimary={{
        wording: 'ButtonPrimary',
        navigateTo: {
          screen: 'CheatcodesStackNavigator',
          params: { screen: 'CheatcodesNavigationGenericPages' },
        },
        icon: PlainArrowPrevious,
      }}
      buttonSecondary={{
        wording: 'ButtonSecondary',
        onPress: navigateToCheatcodesNavigationGenericPages,
        icon: PlainArrowPrevious,
      }}
      buttonTertiary={{
        wording: 'ButtonTertiary',
        navigateTo: {
          screen: 'CheatcodesStackNavigator',
          params: { screen: 'CheatcodesNavigationGenericPages' },
        },
        icon: PlainArrowPrevious,
      }}>
      <Typo.Body>
        Ceci est le texte enfant qui devrait être vraiment très long et passer sur plusieurs lignes
        si besoin.
      </Typo.Body>
    </GenericInfoPage>
  )
}

const StyledBodyXs = styled(Typo.BodyXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.disabled,
}))
