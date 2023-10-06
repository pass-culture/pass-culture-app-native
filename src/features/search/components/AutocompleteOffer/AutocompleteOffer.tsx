import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { CreateHistoryItem } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteOfferProps = UseInfiniteHitsProps & {
  addSearchHistory: (item: CreateHistoryItem) => void
}

export function AutocompleteOffer({ addSearchHistory, ...props }: AutocompleteOfferProps) {
  const { hits, sendEvent } = useInfiniteHits(props)

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompleteOfferTitleText>Suggestions</AutocompleteOfferTitleText>
      <StyledVerticalUl>
        {hits.map((item, index) => (
          <Li key={item.objectID}>
            <AutocompleteOfferItem
              hit={item as unknown as AlgoliaSuggestionHit}
              sendEvent={sendEvent}
              addSearchHistory={addSearchHistory}
              shouldShowCategory={index < 3}
            />
          </Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  ) : null
}

const StyledVerticalUl = styled(VerticalUl)({
  marginTop: getSpacing(4),
})

const AutocompleteOfferTitleText = styled(Typo.Caption).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
