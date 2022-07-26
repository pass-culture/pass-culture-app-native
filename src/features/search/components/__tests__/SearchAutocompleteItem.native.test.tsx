import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState, SearchView } from 'features/search/types'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnum.CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockStagedSearchState, dispatch: mockStagedDispatch }),
}))

describe('SearchAutocompleteItem component', () => {
  const hit = {
    objectID: '1',
    offer: { name: 'Test1', searchGroupName: SearchGroupNameEnum.MUSIQUE },
    _geoloc: {},
  }

  it('should render SearchAutocompleteItem', () => {
    expect(render(<SearchAutocompleteItem index={0} hit={hit} />)).toMatchSnapshot()
  })

  it('should display the search group name if the hit is in the top three', () => {
    const { getByTestId } = render(<SearchAutocompleteItem index={0} hit={hit} />)

    expect(getByTestId('autocompleteItemWithCategory')).toBeTruthy()
  })

  it('should not display the search group name if the hit is not in the top three', () => {
    const { queryByText } = render(<SearchAutocompleteItem index={3} hit={hit} />)

    expect(queryByText(hit.offer.name)).toBeTruthy()
  })

  it('should execute a search with the name of the selected offer on hit click', async () => {
    const { getByTestId } = render(<SearchAutocompleteItem index={0} hit={hit} />)
    await fireEvent.press(getByTestId('autocompleteItem'))

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: hit.offer.name,
        offerCategories: [hit.offer.searchGroupName],
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
        view: SearchView.Results,
      })
    )
  })

  it('should not display the search group name if the hit is in the top three and search group name is NONE', () => {
    const hitWithNoneSearchGroup = {
      ...hit,
      offer: {
        ...hit.offer,
        searchGroupName: SearchGroupNameEnum.NONE,
      },
    }

    const { queryByText } = render(
      <SearchAutocompleteItem index={0} hit={hitWithNoneSearchGroup} />
    )

    expect(queryByText(hit.offer.name)).toBeTruthy()
  })
})
