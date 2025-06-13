import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/searchStackHelpers'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

export const NoContentError = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToSearchTab = () => navigate(...getSearchStackConfig('SearchLanding'))

  const helmetTitle =
    'Page erreur\u00a0: Erreur pendant le chargement de nos recommandations | pass Culture'

  return (
    <GenericErrorPage
      helmetTitle={helmetTitle}
      title="Oups&nbsp;!"
      subtitle="Une erreur s’est produite pendant le chargement de nos recommandations."
      illustration={BrokenConnection}
      buttonPrimary={{
        wording: 'Rechercher une offre',
        icon: MagnifyingGlass,
        onPress: navigateToSearchTab,
      }}
    />
  )
}
