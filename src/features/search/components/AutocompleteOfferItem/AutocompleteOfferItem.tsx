import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { FunctionComponent, ReactNode } from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  categoryExists,
  getCategory,
  getCategoryParents,
  isChild,
  isTopLevelCategory,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteOfferItemProps = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
  addSearchHistory: (item: CreateHistoryItem) => void
  contextCategories?: SearchGroupNameEnumv2[]
}

export function AutocompleteOfferItem({
  hit,
  sendEvent,
  addSearchHistory,
  contextCategories = [],
}: Readonly<AutocompleteOfferItemProps>) {
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const currentRoute = useCurrentRoute()?.name
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { disabilities } = useAccessibilityFiltersContext()

  // https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/#suggestions-with-categories-index-schema
  const { query, [env.ALGOLIA_OFFERS_INDEX_NAME]: indexInfos } = hit
  const {
    ['offer.searchGroupNamev2']: categories = [],
    ['offer.nativeCategoryId']: nativeCategories = [],
  } = indexInfos?.facets?.analytics || {}

  const topLevelCategorySuggestion = categories
    .filter((category) => categoryExists(category.value))
    .toSorted((a, b) => b.count - a.count)[0]?.value
  const subcategorySuggestion = nativeCategories.toSorted((a, b) => b.count - a.count)[0]?.value

  if (!topLevelCategorySuggestion && !subcategorySuggestion) return

  const subcategoryParents = subcategorySuggestion ? getCategoryParents(subcategorySuggestion) : []
  const contextCategory = contextCategories[0]
  const isSuggestionInContext =
    subcategorySuggestion && contextCategory && isChild(subcategorySuggestion, contextCategory)
  const shouldDisplaySubcategory =
    (!contextCategory || isSuggestionInContext) &&
    subcategoryParents.length === 1 &&
    subcategorySuggestion !== NativeCategoryIdEnumv2.LIVRES_PAPIER &&
    subcategorySuggestion // `shouldDisplaySubcategory` is true already implies `subcategorySuggestion` is true, but here it helps later typing

  const label = shouldDisplaySubcategory
    ? getCategory(subcategorySuggestion)?.label
    : topLevelCategorySuggestion && getCategory(topLevelCategorySuggestion)?.label

  if (!label) return

  const shouldFilterOnNativeCategory =
    shouldDisplaySubcategory &&
    topLevelCategorySuggestion &&
    isChild(subcategorySuggestion, topLevelCategorySuggestion)
  const subcategoryFilterOnPress = shouldFilterOnNativeCategory ? [subcategorySuggestion] : []
  const topLevelFilterOnPress =
    shouldDisplaySubcategory && subcategoryParents[0] && isTopLevelCategory(subcategoryParents[0])
      ? subcategoryParents[0].key
      : topLevelCategorySuggestion

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    const searchId = uuidv4()
    const newSearchState: SearchState = {
      ...searchState,
      query,
      searchId,
      isAutocomplete: true,
      offerGenreTypes: undefined,
      offerNativeCategories: subcategoryFilterOnPress,
      offerCategories: topLevelFilterOnPress ? [topLevelFilterOnPress] : [],
      isFromHistory: undefined,
      gtls: [],
    }
    dispatch({ type: 'SET_STATE', payload: newSearchState })
    addSearchHistory({
      query,
      nativeCategory: shouldFilterOnNativeCategory ? subcategorySuggestion : undefined,
      category: topLevelFilterOnPress,
    })
    if ([SearchView.Landing, SearchView.Thematic].includes(currentRoute as SearchView))
      navigateToSearchResults(newSearchState, disabilities)
    hideSuggestions()
  }

  const testID = `autocompleteOfferItem_${hit.objectID}`

  return (
    <SuggestionContainer hit={hit} onPress={onPress} testID={testID}>
      <Suggestion category={label} />
    </SuggestionContainer>
  )
}

const SuggestionContainer: FunctionComponent<{
  hit: AlgoliaSuggestionHit
  onPress: () => void
  testID: string
  children: ReactNode
}> = ({ hit, onPress, testID, children }) => (
  <AutocompleteItemTouchable testID={testID} onPress={onPress}>
    <MagnifyingGlassIconContainer>
      <MagnifyingGlassFilledIcon />
    </MagnifyingGlassIconContainer>
    <StyledText numberOfLines={1} ellipsizeMode="tail">
      <Highlight suggestionHit={hit} attribute="query" />
      {children}
    </StyledText>
  </AutocompleteItemTouchable>
)

const Suggestion: FunctionComponent<{ category: string }> = ({ category }) => (
  <React.Fragment>
    <Typo.Body> dans </Typo.Body>
    <Typo.ButtonTextPrimary>{category}</Typo.ButtonTextPrimary>
  </React.Fragment>
)

const MagnifyingGlassIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassFilledIcon = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
