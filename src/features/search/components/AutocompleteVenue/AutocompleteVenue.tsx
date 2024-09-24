import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'

import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { AlgoliaVenue } from 'libs/algolia/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AutocompleteVenueProps = UseInfiniteHitsProps & {
  title?: string
  withPois?: boolean
  onItemPress: (venueId: number) => void
}

const poi1: AlgoliaVenue = {
  objectID: 'hello-1',
  city: 'Paris',
  postalCode: '92200',
  name: 'Librairie',
  offerer_name: 'Je ne sais pas',
  venue_type: null,
  description: 'Ceci est une description',
  audio_disability: null,
  mental_disability: null,
  motor_disability: null,
  visual_disability: null,
  email: 'biblioteque@passculture.app',
  phone_number: null,
  website: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  banner_url: null,
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

const poi2: AlgoliaVenue = {
  objectID: 'hello-2',
  city: 'Marseille',
  postalCode: '92200',
  name: 'Librairie',
  offerer_name: 'Je ne sais pas',
  venue_type: null,
  description: 'Ceci est une description',
  audio_disability: null,
  mental_disability: null,
  motor_disability: null,
  visual_disability: null,
  email: 'biblioteque@passculture.app',
  phone_number: null,
  website: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  banner_url: null,
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

export function AutocompleteVenue({
  title,
  withPois,
  onItemPress,
  ...props
}: AutocompleteVenueProps) {
  const { hits } = useInfiniteHits(props)

  const items = withPois ? pois : hits

  return hits.length > 0 ? (
    <React.Fragment>
      <AutocompleteVenueTitleText>{title}</AutocompleteVenueTitleText>

      <StyledVerticalUl>
        {items.map((item) => (
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
