import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { AutocompleteSection } from 'features/search/components/AutocompleteSection/AutocompleteSection'
import { CreateHistoryItem } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'

type Props = {
  addSearchHistory: (item: CreateHistoryItem) => void
  offerCategories?: SearchGroupNameEnumv2[]
}

export function AutocompleteOffer({ addSearchHistory, offerCategories }: Props) {
  return (
    <AutocompleteSection<AlgoliaSuggestionHit>
      title="Suggestions"
      renderItem={(hit, sendEvent) => (
        <AutocompleteOfferItem
          hit={hit}
          sendEvent={sendEvent}
          addSearchHistory={addSearchHistory}
          shouldShowCategory
          offerCategories={offerCategories || []}
        />
      )}
    />
  )
}
