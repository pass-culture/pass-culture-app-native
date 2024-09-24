import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { AutocompletePoisItem } from 'features/search/components/AutocompletePois/AutocompletePoisItem'
import { AlgoliaPois } from 'libs/algolia/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompletePoisProps = UseInfiniteHitsProps & {
  onItemPress: (venueId: number) => void
}

const poi1: AlgoliaPois = {
  objectID: '1',
  city: 'Paris',
  postalCode: '92200',
  name: 'Librairie',
  description: 'Ceci est une description',
  email: 'biblioteque@passculture.app',
  phone_number: null,
  _geoloc: { lat: null, lng: null },
  _highlightResult: {
    name: {
      fullyHighlighted: true,
      matchLevel: 'go',
      matchedWords: [],
      value: 'Librairie des Pokemons',
    },
  },
}

const poi2: AlgoliaPois = {
  objectID: '2',
  city: 'Marseille',
  postalCode: '92200',
  name: 'Librairie',
  description: 'Ceci est une description',
  email: 'biblioteque@passculture.app',
  phone_number: null,
  _geoloc: { lat: null, lng: null },
  _highlightResult: {
    name: {
      fullyHighlighted: true,
      matchLevel: 'go',
      matchedWords: [],
      value: 'Librairie des Lutins',
    },
  },
}

const pois = [poi1, poi2]

export function AutocompletePois({ onItemPress, ...props }: AutocompletePoisProps) {
  const { hits } = useInfiniteHits(props)

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompletePoisTitleText>Points d’intérets</AutocompletePoisTitleText>

      <StyledVerticalUl>
        {pois.map((item) => (
          <Li key={item.objectID}>
            <AutocompletePoisItem
              hit={item as unknown as AlgoliaPois}
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

const AutocompletePoisTitleText = styled(Typo.Caption).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
