import React from 'react'
import { styled } from 'styled-components/native'

import { AutocompleteItem } from 'features/search/components/AutocompleteItem/AutocompleteItem'
import { AutocompleteSection } from 'features/search/components/AutocompleteSection/AutocompleteSection'
import { ArtistHitHighlight } from 'features/search/components/Highlight/Highlight'
import { SuggestionsSnapshot } from 'features/search/context/SearchSuggestionsAccessibilityProvider'
import { AlgoliaArtist } from 'libs/algolia/types'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'

type Props = {
  onItemPress: (artistId: string, artistName: string) => void
  onSuggestionsChange?: (snapshot: SuggestionsSnapshot) => void
}

export function AutocompleteArtist({ onItemPress, onSuggestionsChange }: Props) {
  return (
    <AutocompleteSection<AlgoliaArtist>
      title="Artistes"
      renderItem={(hit) => {
        const handlePress = () => {
          onItemPress(hit.objectID, hit.name)
        }

        return (
          <AutocompleteItem
            onPress={handlePress}
            testID={`autocompleteArtistItem_${hit.objectID}`}
            icon={<ProfileFilledIcon />}>
            <ArtistHitHighlight artistHit={hit} />
          </AutocompleteItem>
        )
      }}
      onSuggestionsChange={onSuggestionsChange}
    />
  )
}

const ProfileFilledIcon = styled(ProfileFilled).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
  color: theme.designSystem.color.icon.subtle,
}))``
