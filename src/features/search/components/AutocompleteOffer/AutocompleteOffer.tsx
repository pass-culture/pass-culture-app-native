import type { BaseHit, Hit } from 'instantsearch.js'
import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { CreateHistoryItem } from 'features/search/types'
import type { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteOfferProps = UseInfiniteHitsProps & {
  addSearchHistory: (item: CreateHistoryItem) => void
  offerCategories?: SearchGroupNameEnumv2[]
  shouldShowCategory?: boolean
}

const isAlgoliaSuggestionHitArray = (hits: Hit<BaseHit>[]): hits is AlgoliaSuggestionHit[] => {
  return hits.every((hit) => 'query' in hit)
}

export function AutocompleteOffer({
  addSearchHistory,
  offerCategories,
  ...props
}: AutocompleteOfferProps) {
  const { hits, sendEvent } = useInfiniteHits(props)
  if (!isAlgoliaSuggestionHitArray(hits)) return null

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompleteOfferTitleText>Suggestions</AutocompleteOfferTitleText>
      <StyledVerticalUl>
        {hits.map((item) => (
          <Li key={item.objectID}>
            <AutocompleteOfferItem
              hit={item}
              sendEvent={sendEvent}
              addSearchHistory={addSearchHistory}
              shouldShowCategory
              offerCategories={offerCategories || []}
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
