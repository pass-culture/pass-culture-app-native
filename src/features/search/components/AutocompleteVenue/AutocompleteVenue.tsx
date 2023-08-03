import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'

import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { AlgoliaVenue } from 'libs/algolia'
import { Li } from 'ui/components/Li'
import { getSpacing } from 'ui/theme'

type AutocompleteVenueProps = UseInfiniteHitsProps

export function AutocompleteVenue({ ...props }: AutocompleteVenueProps) {
  const { hits } = useInfiniteHits(props)

  return (
    <React.Fragment>
      {hits.map((item) => (
        <StyledLi key={item.objectID}>
          <AutocompleteVenueItem hit={item as unknown as AlgoliaVenue} />
        </StyledLi>
      ))}
    </React.Fragment>
  )
}

const StyledLi = styled(Li)({
  paddingHorizontal: getSpacing(6),
})
