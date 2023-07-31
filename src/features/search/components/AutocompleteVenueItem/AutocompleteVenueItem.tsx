import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaVenue } from 'libs/algolia'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteVenueItemProps = {
  hit: AlgoliaVenue
}

export function AutocompleteVenueItem({ hit }: AutocompleteVenueItemProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  const onPress = () => {
    navigate('Venue', { id: Number(hit.objectID) })
  }

  const city = ` ${hit.city}`

  return (
    <AutocompleteItemTouchable testID="autocompleteVenueItem" onPress={onPress}>
      <LocationBuildingIconContainer>
        <LocationBuildingIcon />
      </LocationBuildingIconContainer>
      <StyledText numberOfLines={1} ellipsizeMode="tail">
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

const LocationBuildingIcon = styled(LocationBuilding).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
