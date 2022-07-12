import React from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { AlgoliaHit } from 'libs/algolia'
import { analytics } from 'libs/firebase/analytics'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  hit: AlgoliaHit
  index: number
  setShouldAutocomplete: (shouldAutocomplete: boolean) => void
}

export const SearchAutocompleteItem: React.FC<Props> = ({ hit, index, setShouldAutocomplete }) => {
  const limitResultWithCategory = 3
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const searchGroupName = hit.offer.searchGroupName as SearchGroupNameEnum
  const offerName = hit.offer.name
  const offerIn = ' dans '
  const offerSearchGroup = searchGroupLabelMapping[searchGroupName]
  const { searchState: stagedSearchState } = useStagedSearch()
  const { locationFilter } = stagedSearchState
  const showResultsWithStagedSearch = usePushWithStagedSearch()

  const onPress = () => {
    setShouldAutocomplete(false)
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { priceRange } = stagedSearchState
    showResultsWithStagedSearch({
      showResults: true,
      query: offerName,
      locationFilter,
      offerCategories: [searchGroupName],
      priceRange,
    })

    analytics.logSearchQuery(offerName || '')
  }

  return (
    <AutocompleteItemTouchable onPress={onPress}>
      <MagnifyingGlassIcon />
      <StyledText numberOfLines={1} ellipsizeMode="tail">
        <Typo.Body>{offerName}</Typo.Body>
        {index < limitResultWithCategory && searchGroupName !== SearchGroupNameEnum.NONE ? (
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
