import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'

import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { Li } from 'ui/components/Li'
import { getSpacing } from 'ui/theme'

type AutocompleteOfferProps = UseInfiniteHitsProps

export function AutocompleteOffer({ ...props }: AutocompleteOfferProps) {
  const { hits, sendEvent } = useInfiniteHits(props)

  return (
    <React.Fragment>
      {hits.map((item, index) => (
        <StyledLi key={item.objectID}>
          <AutocompleteOfferItem
            hit={item as unknown as AlgoliaSuggestionHit}
            sendEvent={sendEvent}
            shouldShowCategory={index < 3}
          />
        </StyledLi>
      ))}
    </React.Fragment>
  )
}

const StyledLi = styled(Li)({
  paddingHorizontal: getSpacing(6),
})
