import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaVenue } from 'libs/algolia/types'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteVenueItemProps = {
  hit: AlgoliaVenue
  onPress: () => Promise<void>
}

export function AutocompleteVenueItem({ hit, onPress }: AutocompleteVenueItemProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  async function handlePress() {
    await onPress()
    navigate('Venue', { id: Number(hit.objectID) })
  }

  const city = ` ${hit.city}`
  const testID = `autocompleteVenueItem_${hit.objectID}`

  return (
    <AutocompleteItemTouchable testID={testID} onPress={handlePress}>
      <LocationBuildingIconContainer>
        <LocationBuildingFilledIcon />
      </LocationBuildingIconContainer>
      <StyledText numberOfLines={2} ellipsizeMode="tail">
        <Highlight venueHit={hit} attribute="name" />
        <Typo.Body>{city}</Typo.Body>
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const LocationBuildingIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const LocationBuildingFilledIcon = styled(LocationBuildingFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
