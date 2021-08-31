import { t, plural } from '@lingui/macro'
import React, { useEffect, useState } from 'react'

import { useCommit } from 'features/search/pages/SearchWrapper'
import { useStagedSearchResults } from 'features/search/pages/useSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 0) return t`Aucun résultat`
  if (nbHits > 1000) return t`Afficher les 999+ résultats`
  return plural(nbHits, {
    one: 'Afficher # résultat',
    other: 'Afficher les # résultats',
  })
}

export const ShowResults: React.FC = () => {
  const { commit } = useCommit()
  const { data, isFetching } = useStagedSearchResults()
  const [nbHits, setNbHits] = useState<number>(data && data.pages ? data.pages[0].nbHits : 0)

  useEffect(() => {
    if (!isFetching) {
      setNbHits(data && data.pages ? data.pages[0].nbHits : 0)
    }
  }, [data, isFetching])

  const onPress = () => {
    commit()
  }

  return (
    <ButtonPrimary
      title={formatNbHits(nbHits)}
      disabled={nbHits === 0}
      onPress={onPress}
      adjustsFontSizeToFit={true}
    />
  )
}
