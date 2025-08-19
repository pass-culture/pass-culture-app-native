import React from 'react'
import { styled } from 'styled-components/native'

import { AutocompleteItem } from 'features/search/components/AutocompleteItem/AutocompleteItem'
import { AutocompleteSection } from 'features/search/components/AutocompleteSection/AutocompleteSection'
import { VenueHitHighlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaVenue } from 'libs/algolia/types'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { Typo } from 'ui/theme'

type Props = {
  onItemPress: (venueId: number) => void
}

export function AutocompleteVenue({ onItemPress }: Props) {
  return (
    <AutocompleteSection<AlgoliaVenue>
      title="Lieux culturels"
      renderItem={(hit) => {
        const handlePress = () => {
          onItemPress(Number(hit.objectID))
        }

        return (
          <AutocompleteItem
            onPress={handlePress}
            testID={`autocompleteVenueItem_${hit.objectID}`}
            icon={<LocationBuildingFilledIcon />}>
            <VenueHitHighlight venueHit={hit} />
            <Typo.Body>{` ${hit.city}`}</Typo.Body>
          </AutocompleteItem>
        )
      }}
    />
  )
}

const LocationBuildingFilledIcon = styled(LocationBuildingFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``
