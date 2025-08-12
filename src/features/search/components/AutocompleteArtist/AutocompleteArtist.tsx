import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { AutocompleteArtistItem } from 'features/search/components/AutocompleteArtistItem/AutocompleteArtistItem'
import { AlgoliaArtist } from 'libs/algolia/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteArtistProps = UseInfiniteHitsProps & {
  onItemPress: (artistName: string) => void
}

export function AutocompleteArtist({ onItemPress, ...props }: AutocompleteArtistProps) {
  const { hits } = useInfiniteHits(props)

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompleteVenueTitleText>Artistes</AutocompleteVenueTitleText>

      <StyledVerticalUl>
        {hits.map((item) => (
          <Li key={item.objectID}>
            <AutocompleteArtistItem
              hit={item as unknown as AlgoliaArtist}
              onPress={() => onItemPress(item.objectID)}
            />
          </Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  ) : null
}

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const AutocompleteVenueTitleText = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(
  ({ theme }) => ({
    color: theme.designSystem.color.text.subtle,
  })
)
