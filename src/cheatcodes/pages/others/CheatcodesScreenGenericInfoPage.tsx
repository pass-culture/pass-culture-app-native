import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
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
      title="Title"
      subtitle="Subtitle"
      buttonsSurtitle={<StyledBodyXs>Attention&nbsp;: ceci est un surtitre</StyledBodyXs>}
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
      <Typo.Body>Children...</Typo.Body>
    </GenericInfoPage>
  )
}

const StyledBodyXs = styled(Typo.BodyXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.disabled,
}))
