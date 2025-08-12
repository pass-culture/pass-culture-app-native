import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ArtistHitHighlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaArtist } from 'libs/algolia/types'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'
import { Typo } from 'ui/theme'

type AutocompleteArtistItemProps = {
  hit: AlgoliaArtist
  onPress: () => void
}

export function AutocompleteArtistItem({ hit, onPress }: AutocompleteArtistItemProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  const handlePress = () => {
    onPress()
    navigate('Artist', { id: hit.objectID })
  }

  const testID = `autocompleteArtistItem_${hit.objectID}`

  return (
    <AutocompleteItemTouchable testID={testID} onPress={handlePress}>
      <IconContainer>
        <ProfileFilledIcon />
      </IconContainer>
      <StyledText numberOfLines={2} ellipsizeMode="tail">
        <ArtistHitHighlight artistHit={hit} />
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const IconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const ProfileFilledIcon = styled(ProfileFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``

const StyledText = styled(Typo.Body)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
}))
