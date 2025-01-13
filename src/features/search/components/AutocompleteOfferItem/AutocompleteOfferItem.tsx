import { useNavigationState } from '@react-navigation/native'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { useMemo, FunctionComponent, ReactNode } from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  getNativeCategoryFromEnum,
  getSearchGroupsEnumArrayFromNativeCategoryEnum,
  isNativeCategoryOfCategory,
  useNativeCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { useSearchGroupLabel } from 'libs/subcategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteOfferItemProps = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
  addSearchHistory: (item: CreateHistoryItem) => void
  shouldShowCategory?: boolean
  offerCategories?: SearchGroupNameEnumv2[]
}

export function AutocompleteOfferItem({
  hit,
  sendEvent,
  addSearchHistory,
  shouldShowCategory,
  offerCategories = [],
}: Readonly<AutocompleteOfferItemProps>) {
  // There is a BPMN describing the business rules for this component at ./AutocompleteOfferItem.mmd
  const { query, [env.ALGOLIA_OFFERS_INDEX_NAME]: indexInfos } = hit
  // https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/adding-category-suggestions/js/#suggestions-with-categories-index-schema
  const {
    ['offer.searchGroupNamev2']: categories = [],
    ['offer.nativeCategoryId']: nativeCategories = [],
  } = indexInfos?.facets?.analytics || {}

  const mappedNativeCategories = useNativeCategories(offerCategories[0])

  const { searchState, dispatch, hideSuggestions } = useSearch()
  const routes = useNavigationState((state) => state.routes)
  const currentRoute = routes?.at(-1)?.name
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { disabilities } = useAccessibilityFiltersContext()
  const { data } = useSubcategories()

  const availableCategories = useAvailableCategories()

  const availableCategoriesList: SearchGroupNameEnumv2[] = availableCategories.map(
    (availableCategory) => availableCategory.facetFilter
  )

  const filteredCategories = categories
    .sort((a, b) => b.count - a.count)
    .filter((category) => availableCategoriesList.includes(category.value))

  const searchGroupLabel = useSearchGroupLabel(
    filteredCategories[0]?.value ?? SearchGroupNameEnumv2.NONE
  )

  const orderedNativeCategories = nativeCategories.sort((a, b) => b.count - a.count)

  const isQueryFromThematicSearch = !!offerCategories.length

  const isNativeCategoryRelatedToSearchGroup = useMemo(() => {
    return mappedNativeCategories.some(
      (searchGroupNativeCategory) =>
        orderedNativeCategories[0] &&
        searchGroupNativeCategory[0] === orderedNativeCategories[0].value
    )
  }, [mappedNativeCategories, orderedNativeCategories])

  const hasMostPopularHitNativeCategory =
    orderedNativeCategories[0]?.value && orderedNativeCategories[0].value in NativeCategoryIdEnumv2

  const mostPopularNativeCategoryId = hasMostPopularHitNativeCategory
    ? orderedNativeCategories[0]?.value
    : undefined

  const mostPopularNativeCategoryValue = getNativeCategoryFromEnum(
    data,
    mostPopularNativeCategoryId
  )?.value

  const hasMostPopularHitCategory =
    filteredCategories[0]?.value && filteredCategories[0].value in SearchGroupNameEnumv2

  const searchGroupFromNativeCategory = useMemo(
    () =>
      getSearchGroupsEnumArrayFromNativeCategoryEnum(
        data,
        mostPopularNativeCategoryId,
        availableCategoriesList
      ),
    [data, mostPopularNativeCategoryId, availableCategoriesList]
  )
  const hasSeveralCategoriesFromNativeCategory = searchGroupFromNativeCategory.length > 1
  const isAssociatedMostPopularNativeCategoryToMostPopularCategory = useMemo(
    () =>
      isNativeCategoryOfCategory(data, filteredCategories[0]?.value, mostPopularNativeCategoryId),
    [filteredCategories, data, mostPopularNativeCategoryId]
  )

  const shouldDisplayNativeCategory =
    hasMostPopularHitNativeCategory &&
    ((isQueryFromThematicSearch && isNativeCategoryRelatedToSearchGroup) ||
      !isQueryFromThematicSearch) &&
    !hasSeveralCategoriesFromNativeCategory

  const isLivresPapierNativeCategory =
    orderedNativeCategories[0]?.value == NativeCategoryIdEnumv2.LIVRES_PAPIER

  const shouldUseSearchGroupInsteadOfNativeCategory =
    !shouldDisplayNativeCategory ||
    isLivresPapierNativeCategory ||
    (isQueryFromThematicSearch && !isNativeCategoryRelatedToSearchGroup)

  const mostPopularCategory = useMemo(() => {
    if (
      hasSeveralCategoriesFromNativeCategory ||
      !hasMostPopularHitNativeCategory ||
      shouldUseSearchGroupInsteadOfNativeCategory
    ) {
      return filteredCategories[0]?.value && filteredCategories[0].value in SearchGroupNameEnumv2
        ? [filteredCategories[0].value]
        : []
    } else {
      return searchGroupFromNativeCategory[0] &&
        searchGroupFromNativeCategory[0] in SearchGroupNameEnumv2
        ? [searchGroupFromNativeCategory[0]]
        : []
    }
  }, [
    filteredCategories,
    searchGroupFromNativeCategory,
    hasMostPopularHitNativeCategory,
    hasSeveralCategoriesFromNativeCategory,
    shouldUseSearchGroupInsteadOfNativeCategory,
  ])

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    const shouldFilterOnNativeCategory =
      shouldShowCategory &&
      hasMostPopularHitNativeCategory &&
      !shouldUseSearchGroupInsteadOfNativeCategory &&
      ((hasSeveralCategoriesFromNativeCategory &&
        isAssociatedMostPopularNativeCategoryToMostPopularCategory) ||
        !hasSeveralCategoriesFromNativeCategory)
    const newSearchState: SearchState = {
      ...searchState,
      query,
      searchId,
      isAutocomplete: true,
      offerGenreTypes: undefined,
      offerNativeCategories:
        shouldFilterOnNativeCategory && orderedNativeCategories[0]?.value
          ? [orderedNativeCategories[0].value]
          : [],
      offerCategories: shouldShowCategory ? mostPopularCategory : [],
      isFromHistory: undefined,
      gtls: [],
    }
    addSearchHistory({
      query,
      nativeCategory: shouldFilterOnNativeCategory ? orderedNativeCategories[0]?.value : undefined,
      category: shouldShowCategory ? mostPopularCategory[0] : undefined,
    })
    dispatch({ type: 'SET_STATE', payload: newSearchState })
    if (
      currentRoute &&
      [SearchView.Landing, SearchView.Thematic].includes(currentRoute as SearchView)
    ) {
      navigateToSearchResults(newSearchState, disabilities)
    }
    hideSuggestions()
  }

  const shouldDisplayCategorySuggestion =
    shouldShowCategory && (hasMostPopularHitNativeCategory || hasMostPopularHitCategory)

  const categoryToDisplay =
    shouldUseSearchGroupInsteadOfNativeCategory && searchGroupLabel !== 'None'
      ? searchGroupLabel
      : mostPopularNativeCategoryValue

  const testID = `autocompleteOfferItem_${hit.objectID}`

  return (
    <SuggestionContainer hit={hit} onPress={onPress} testID={testID}>
      {shouldDisplayCategorySuggestion && categoryToDisplay ? (
        <Suggestion categoryToDisplay={categoryToDisplay} />
      ) : undefined}
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

const Suggestion: FunctionComponent<{ categoryToDisplay: string }> = ({ categoryToDisplay }) => (
  <React.Fragment>
    <Typo.Body> dans </Typo.Body>
    <StyledBodyAccent>{categoryToDisplay}</StyledBodyAccent>
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

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.colors.primary,
}))
