import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { AlgoliaPois } from 'libs/algolia/types'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompletePoisItemProps = {
  hit: AlgoliaPois
  onPress: () => void
}

export function AutocompletePoisItem({ hit, onPress }: AutocompletePoisItemProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  const handlePress = () => {
    onPress()
    navigate('Venue', { id: Number(hit.objectID) })
    // navigate('Poi', { id: Number(hit.objectID) })
  }

  const city = ` ${hit.city}`
  const testID = `autocompletePoisItem_${hit.objectID}`

  return (
    <AutocompleteItemTouchable testID={testID} onPress={handlePress}>
      <LocationBuildingIconContainer>
        <LocationBuildingFilledIcon />
      </LocationBuildingIconContainer>
      <StyledText numberOfLines={2} ellipsizeMode="tail">
        <Highlight poiHit={hit} attribute="name" />
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
