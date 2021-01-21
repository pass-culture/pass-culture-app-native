import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { connectStats } from 'react-instantsearch-native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 0) return _(t`Aucun résultat`)
  if (nbHits === 1) return _(t`Afficher ${nbHits} résultat`)
  if (nbHits > 1000) return _(t`Afficher les 999+ résultats`)
  return _(t`Afficher les ${nbHits} résultats`)
}

export const SearchResultsButtonComponent: React.FC<{ nbHits: number }> = ({ nbHits }) => {
  const { goBack } = useNavigation<UseNavigationType>()
  return (
    <ButtonPrimary
      title={formatNbHits(nbHits)}
      disabled={nbHits === 0}
      onPress={goBack}
      adjustsFontSizeToFit={true}
    />
  )
}

export const SearchResultsButton = connectStats(SearchResultsButtonComponent)
