import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaVenue } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteVenueItemProps = {
  hit: AlgoliaVenue
}

export function AutocompleteVenueItem({ hit }: AutocompleteVenueItemProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  async function onPress() {
    await analytics.logConsultVenue({ venueId: Number(hit.objectID), from: 'searchAutoComplete' })
    navigate('Venue', { id: Number(hit.objectID) })
  }

  const city = ` ${hit.city}`
  const testID = `autocompleteVenueItem_${hit.objectID}`

  return (
    <AutocompleteItemTouchable testID={testID} onPress={onPress}>
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
