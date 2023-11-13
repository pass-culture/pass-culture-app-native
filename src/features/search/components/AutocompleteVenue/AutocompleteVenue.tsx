import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { AlgoliaVenue } from 'libs/algolia'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteVenueProps = UseInfiniteHitsProps & {
  onItemPress: (venueId: number) => Promise<void>
}

export function AutocompleteVenue({ onItemPress, ...props }: AutocompleteVenueProps) {
  const { hits } = useInfiniteHits(props)

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompleteVenueTitleText>Lieux culturels</AutocompleteVenueTitleText>

      <StyledVerticalUl>
        {hits.map((item) => (
          <Li key={item.objectID}>
            <AutocompleteVenueItem
              hit={item as unknown as AlgoliaVenue}
              onPress={() => onItemPress(Number(item.objectID))}
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

const AutocompleteVenueTitleText = styled(Typo.Caption).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
