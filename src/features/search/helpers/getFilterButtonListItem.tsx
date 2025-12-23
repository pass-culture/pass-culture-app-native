import { FILTER_TYPES } from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { SearchState } from 'features/search/types'
import { ellipseString } from 'shared/string/ellipseString'
import { FilterButtonListItem } from 'ui/components/FilterButtonList'

const MAX_VENUE_CHARACTERS = 20

type Props = {
  showCalendarModal: () => void
  appliedFilters: FILTER_TYPES[]
  searchState: SearchState
  showVenueModal: () => void
  isVenue: boolean
  showCategoriesModal: () => void
  showSearchPriceModal: () => void
  hasDuoOfferToggle: boolean
  showOfferDuoModal: () => void
  showAccessibilityModal: () => void
}

export const getFilterButtonListItem = ({
  showCalendarModal,
  appliedFilters,
  searchState,
  showVenueModal,
  isVenue,
  showCategoriesModal,
  showSearchPriceModal,
  hasDuoOfferToggle,
  showOfferDuoModal,
  showAccessibilityModal,
}: Props): FilterButtonListItem[] => {
  return [
    {
      label: 'Dates',
      testID: 'datesHoursButton',
      onPress: showCalendarModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.DATES_HOURS),
    },
    {
      label: searchState.venue?.label
        ? ellipseString(searchState.venue.label, MAX_VENUE_CHARACTERS)
        : 'Lieu culturel',
      testID: 'venueButton',
      onPress: showVenueModal,
      isApplied: isVenue,
    },
    {
      label: 'Catégories',
      testID: 'categoryButton',
      onPress: showCategoriesModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.CATEGORIES),
    },
    {
      label: 'Prix',
      testID: 'priceButton',
      onPress: showSearchPriceModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.PRICES),
    },
    ...(hasDuoOfferToggle
      ? [
          {
            label: 'Duo',
            testID: 'DuoButton',
            onPress: showOfferDuoModal,
            isApplied: appliedFilters.includes(FILTER_TYPES.OFFER_DUO),
          },
        ]
      : []),
    {
      label: 'Accessibilité',
      testID: 'lieuxAccessiblesButton',
      onPress: showAccessibilityModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.ACCESSIBILITY),
    },
  ]
}
