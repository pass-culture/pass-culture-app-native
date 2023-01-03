import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

import { SearchState } from 'features/search/types'

type Props = NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'] & { padding?: number }

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  padding = 20,
}: Props) => layoutMeasurement.height + contentOffset.y >= contentSize.height - padding

export const isCloseToEndHorizontal = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  padding = 0,
}: Props) => layoutMeasurement.width + contentOffset.x >= contentSize.width - padding

// We don't send integers to firebase because they will be cast into int_value, float_value,
// or double_value in BigQuery depending on its value. To facilitate the work of the team,
// we just cast it to string.
export const prepareLogEventParams = (params: Record<string, unknown>) =>
  Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
    acc[key] = typeof params[key] === 'number' ? (params[key] as number).toString() : params[key]
    return acc
  }, {})

const STRING_VALUE_MAX_LENGTH = 100
export const urlWithValueMaxLength = (url: string) => url.slice(0, STRING_VALUE_MAX_LENGTH)

export const buildPerformSearchState = (searchState: SearchState) => ({
  ...(searchState.date !== null && { searchDate: JSON.stringify(searchState.date) }),
  ...(!!searchState.isAutocomplete && { searchIsAutocomplete: searchState.isAutocomplete }),
  searchLocationFilter: JSON.stringify(searchState.locationFilter),
  ...(!!searchState.maxPrice && { searchMaxPrice: searchState.maxPrice }),
  ...(!!searchState.minPrice && { searchMinPrice: searchState.minPrice }),
  ...(searchState.offerCategories.length > 0 && {
    searchCategories: JSON.stringify(searchState.offerCategories),
  }),
  ...(searchState.offerGenreTypes &&
    searchState.offerGenreTypes.length > 0 && {
      searchGenreTypes: JSON.stringify(searchState.offerGenreTypes),
    }),
  ...(searchState.offerIsDuo && { searchOfferIsDuo: searchState.offerIsDuo }),
  ...(searchState.offerIsFree && { searchOfferIsFree: searchState.offerIsFree }),
  ...(searchState.offerNativeCategories &&
    searchState.offerNativeCategories.length > 0 && {
      searchNativeCategories: JSON.stringify(searchState.offerNativeCategories),
    }),
  ...(searchState.query !== '' && { searchQuery: searchState.query }),
  searchId: searchState.searchId,
  ...(searchState.timeRange !== null && { searchTimeRange: JSON.stringify(searchState.timeRange) }),
})
