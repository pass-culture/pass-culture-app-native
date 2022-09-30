import React, { useEffect, useState } from 'react'

import { useCommit } from 'features/search/pages/SearchWrapper'
import { useStagedSearchResults } from 'features/search/pages/useSearchResults'
import { plural } from 'libs/plural'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 0) return 'Aucun résultat'
  if (nbHits > 1000) return 'Afficher les 999+ résultats'
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

  return (
    <ButtonPrimary
      wording={formatNbHits(nbHits)}
      disabled={nbHits === 0}
      onPress={commit}
      adjustsFontSizeToFit={true}
    />
  )
}
