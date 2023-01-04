import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

import { SearchState } from 'features/search/types'
import { PerformSearchState } from 'libs/firebase/analytics/types'

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

export const buildPerformSearchState = (searchState: SearchState) => {
  const state: PerformSearchState = {
    searchLocationFilter: JSON.stringify(searchState.locationFilter),
    searchId: searchState.searchId,
  }

  if (searchState.date !== null) {
    state.searchDate = JSON.stringify(searchState.date)
  }

  if (searchState.isAutocomplete) {
    state.searchIsAutocomplete = searchState.isAutocomplete
  }

  if (searchState.maxPrice) {
    state.searchMaxPrice = searchState.maxPrice
  }

  if (searchState.minPrice) {
    state.searchMinPrice = searchState.minPrice
  }

  if (searchState.offerCategories.length > 0) {
    state.searchCategories = JSON.stringify(searchState.offerCategories)
  }

  if (searchState.offerGenreTypes && searchState.offerGenreTypes.length > 0) {
    state.searchGenreTypes = JSON.stringify(searchState.offerGenreTypes)
  }

  if (searchState.offerIsDuo) {
    state.searchOfferIsDuo = searchState.offerIsDuo
  }

  if (searchState.offerIsFree) {
    state.searchOfferIsFree = searchState.offerIsFree
  }

  if (searchState.offerNativeCategories && searchState.offerNativeCategories.length > 0) {
    state.searchNativeCategories = JSON.stringify(searchState.offerNativeCategories)
  }

  if (searchState.query !== '') {
    state.searchQuery = searchState.query
  }

  if (searchState.timeRange !== null) {
    state.searchTimeRange = JSON.stringify(searchState.timeRange)
  }

  return state
}
