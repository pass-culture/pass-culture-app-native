import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AlgoliaHit } from 'libs/algolia'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  hit: AlgoliaHit
  index: number
}

export const SearchAutocompleteItem: React.FC<Props> = ({ hit, index }) => {
  const limitResultWithCategory = 3
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const { navigate } = useNavigation<UseNavigationType>()
  const searchGroupName = hit.offer.searchGroupName as SearchGroupNameEnum
  const offerId = +hit.objectID || 0
  const offerName = hit.offer.name
  const offerIn = ' dans '
  const offerSearchGroup = searchGroupLabelMapping[searchGroupName]

  return (
    <AutocompleteItemTouchable onPress={() => navigate('Offer', { id: offerId, from: 'search' })}>
      <MagnifyingGlassIcon />
      <StyledText numberOfLines={1} ellipsizeMode="tail">
        <Typo.Body>{offerName}</Typo.Body>
        {index < limitResultWithCategory ? (
          <React.Fragment>
            <OfferIn>{offerIn}</OfferIn>
            <OfferSearchGroup>{offerSearchGroup}</OfferSearchGroup>
          </React.Fragment>
        ) : null}
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const OfferIn = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const OfferSearchGroup = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
