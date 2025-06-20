import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { SearchState } from 'features/search/types'
import { LocationMode } from 'libs/algolia/types'
import { splitArrayIntoStrings } from 'shared/splitArrayIntoStrings/splitArrayIntoStrings'

type Props = NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'] & { padding?: number }

type PerformSearchState = {
  searchLocationFilter: string
  searchView: string
  searchId?: string
  searchDate?: string
  searchIsAutocomplete?: boolean
  searchMaxPrice?: string
  searchMinPrice?: string
  searchCategories?: string
  searchGenreTypes?: string
  searchOfferIsDuo?: boolean
  searchOfferIsFree?: boolean
  searchNativeCategories?: string
  searchQuery?: string
  searchTimeRange?: string
  searchIsBasedOnHistory?: boolean
}

type ModuleDisplayedOnHomepageState = {
  [key: string]: string
}

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  padding = 20,
}: Props) => layoutMeasurement.height + contentOffset.y >= contentSize.height - padding

// We don't send integers to firebase because they will be cast into int_value, float_value,
// or double_value in BigQuery depending on its value. To facilitate the work of the team,
// we just cast it to string.
export const prepareLogEventParams = (params: Record<string, unknown>) =>
  Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
    acc[key] = typeof params[key] === 'number' ? params[key]?.toString() : params[key]
    return acc
  }, {})

const STRING_VALUE_MAX_LENGTH = 100
const LOCATION_LABEL_KEY_LENGTH = 11
export const urlWithValueMaxLength = (url: string) => url.slice(0, STRING_VALUE_MAX_LENGTH)

export const buildLocationFilterParam = (searchState: SearchState) => {
  const { locationFilter, venue } = searchState
  if (locationFilter.locationType === LocationMode.AROUND_PLACE || venue) {
    const stateWithLocationType = {
      locationType: locationFilter.locationType === LocationMode.AROUND_PLACE ? 'PLACE' : 'VENUE',
    }
    const maxLabelLength =
      STRING_VALUE_MAX_LENGTH -
      JSON.stringify(stateWithLocationType).length -
      LOCATION_LABEL_KEY_LENGTH
    const customLocationFilter = {
      ...stateWithLocationType,
      label:
        locationFilter.locationType === LocationMode.AROUND_PLACE
          ? locationFilter.place.label.slice(0, maxLabelLength)
          : venue?.label.slice(0, maxLabelLength),
    }
    return JSON.stringify(customLocationFilter)
  }
  return JSON.stringify(locationFilter)
}

export const buildAccessibilityFilterParam = (disabilities: DisabilitiesProperties): string => {
  const formatAccessibilityFilters: { [key: string]: string } = {
    isAudioDisabilityCompliant: 'Audio',
    isMentalDisabilityCompliant: 'Mental',
    isMotorDisabilityCompliant: 'Motor',
    isVisualDisabilityCompliant: 'Visual',
  }

  const formattedDisability = Object.fromEntries(
    Object.entries(disabilities).map(([key, value]) => [
      formatAccessibilityFilters[key],
      value === undefined ? false : value,
    ])
  )

  return JSON.stringify(formattedDisability, null, 2)
}

const buildSearchDate = (searchState: SearchState) => {
  const startDate =
    searchState.date?.selectedDate ?? searchState.timeRange?.[0] ?? searchState.beginningDatetime
  const endDate = searchState.timeRange?.[1] ?? searchState.endingDatetime
  const option = searchState.date?.option ?? searchState.calendarFilterId

  if (startDate) {
    return JSON.stringify({ startDate, endDate, option })
  }
  return undefined
}

export const buildPerformSearchState = (
  searchState: SearchState,
  currentView: SearchStackRouteName
) => {
  const state: PerformSearchState = {
    searchLocationFilter: buildLocationFilterParam(searchState),
    searchId: searchState.searchId,
    searchView: currentView,
  }

  state.searchDate = buildSearchDate(searchState)

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

  if (searchState.isFromHistory) {
    state.searchIsBasedOnHistory = searchState.isFromHistory
  }
  return state
}

export const buildModuleDisplayedOnHomepage = (
  maxItemsPerString: number,
  offers?: string[],
  venues?: string[]
) => {
  const moduleDisplayedOnHomepageState: ModuleDisplayedOnHomepageState = {}

  const addEntries = (prefix: string, array: string[]) => {
    if (array?.length) {
      const arrayIntoStrings = splitArrayIntoStrings(array, maxItemsPerString)
      arrayIntoStrings.forEach((value, index) => {
        const startValueIndex = index * maxItemsPerString + 1
        const endValueIndex = (index + 1) * maxItemsPerString

        const key = `${prefix}_${startValueIndex}_${endValueIndex}`

        moduleDisplayedOnHomepageState[key] = value
      })
    }
  }

  if (offers?.length) {
    addEntries('offers', offers)
  }
  if (venues?.length) {
    addEntries('venues', venues)
  }

  return moduleDisplayedOnHomepageState
}
