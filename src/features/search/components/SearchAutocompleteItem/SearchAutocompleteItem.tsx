import { useNavigation } from '@react-navigation/native'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useSearchGroupLabel } from 'libs/subcategories'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
  shouldShowCategory?: boolean
}

export const SearchAutocompleteItem: React.FC<Props> = ({ hit, sendEvent, shouldShowCategory }) => {
  const { query, [env.ALGOLIA_OFFERS_INDEX_NAME]: indexInfos } = hit
  const { ['offer.searchGroupNamev2']: categories } = indexInfos.facets.analytics
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const searchGroupLabel = useSearchGroupLabel(
    categories.length > 0 ? categories[0].value : SearchGroupNameEnumv2.NONE
  )
  const hasMostPopularHitCategory = categories.length > 0

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    const shouldFilteredOnCategory = shouldShowCategory && hasMostPopularHitCategory
    const newSearchState: SearchState = {
      ...searchState,
      query,
      view: SearchView.Results,
      searchId,
      isAutocomplete: true,
      ...(!!shouldFilteredOnCategory && { offerCategories: [categories[0].value] }),
    }

    analytics.logPerformSearch(newSearchState)

    navigate(...getTabNavConfig('Search', newSearchState))
  }

  return (
    <AutocompleteItemTouchable testID="autocompleteItem" onPress={onPress}>
      <MagnifyingGlassIconContainer>
        <MagnifyingGlassIcon />
      </MagnifyingGlassIconContainer>
      <StyledText numberOfLines={1} ellipsizeMode="tail">
        <Highlight hit={hit} attribute="query" />
        {!!(shouldShowCategory && hasMostPopularHitCategory) && (
          <React.Fragment>
            <Typo.Body> dans </Typo.Body>
            <Typo.ButtonTextPrimary>{searchGroupLabel}</Typo.ButtonTextPrimary>
          </React.Fragment>
        )}
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const MagnifyingGlassIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
