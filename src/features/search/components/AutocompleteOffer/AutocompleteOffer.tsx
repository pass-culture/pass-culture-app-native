import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'

import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteOfferProps = UseInfiniteHitsProps

export function AutocompleteOffer({ ...props }: AutocompleteOfferProps) {
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
              shouldShowCategory={index < 3}
            />
          </Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  ) : (
    <React.Fragment />
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  marginTop: getSpacing(4),
})

const AutocompleteOfferTitleText = styled(Typo.Caption).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
