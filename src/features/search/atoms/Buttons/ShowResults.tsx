import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearchResults } from 'features/search/pages/useSearchResults'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 0) return _(t`Aucun résultat`)
  if (nbHits === 1) return _(t`Afficher ${nbHits} résultat`)
  if (nbHits > 1000) return _(t`Afficher les 999+ résultats`)
  return _(t`Afficher les ${nbHits} résultats`)
}

export const ShowResults: React.FC = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { data, isFetching } = useSearchResults()
  const [nbHits, setNbHits] = useState<number>(data ? data.pages[0].nbHits : 0)

  useEffect(() => {
    if (!isFetching) {
      setNbHits(data ? data.pages[0].nbHits : 0)
    }
  }, [data, isFetching])

  return (
    <ButtonPrimary
      title={formatNbHits(nbHits)}
      disabled={nbHits === 0}
      onPress={goBack}
      adjustsFontSizeToFit={true}
    />
  )
}
