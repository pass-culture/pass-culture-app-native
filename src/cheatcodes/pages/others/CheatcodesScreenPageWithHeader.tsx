import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'

export const CheatcodesScreenPageWithHeader = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToCheatcodesNavigationGenericPages = () => {
    navigate('CheatcodesNavigationGenericPages')
  }

  return (
    <PageWithHeader
      title="Title"
      scrollChildren={<Typo.Body>Children...</Typo.Body>}
      fixedBottomChildren={
        <ButtonPrimary wording="Retour" onPress={navigateToCheatcodesNavigationGenericPages} />
      }></PageWithHeader>
  )
}
