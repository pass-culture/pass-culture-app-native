import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AutocompleteItem } from 'features/search/components/AutocompleteItem/AutocompleteItem'
import { AutocompleteSection } from 'features/search/components/AutocompleteSection/AutocompleteSection'
import { ArtistHitHighlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaArtist } from 'libs/algolia/types'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'

type Props = {
  onItemPress: (artistName: string) => void
}

export function AutocompleteArtist({ onItemPress }: Props) {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <AutocompleteSection<AlgoliaArtist>
      title="Artistes"
      renderItem={(hit) => {
        const handlePress = () => {
          onItemPress(hit.objectID)
          navigate('Artist', { id: hit.objectID })
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
    />
  )
}

const ProfileFilledIcon = styled(ProfileFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``
