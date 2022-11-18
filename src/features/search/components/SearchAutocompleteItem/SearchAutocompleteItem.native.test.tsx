import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem/SearchAutocompleteItem'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { analytics } from 'libs/firebase/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

const mockSendEvent = jest.fn()

const searchId = uuidv4()

describe('SearchAutocompleteItem component', () => {
  const hit = {
    objectID: '1',
    query: 'cinéma',
    _highlightResult: {
      query: {
        value: '<mark>cinéma</mark>',
        matchLevel: 'full',
        fullyHighlighted: true,
        matchedWords: ['cinéma'],
      },
    },
    __position: 123,
  } as AlgoliaSuggestionHit

  it('should render SearchAutocompleteItem', () => {
    expect(render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)).toMatchSnapshot()
  })

  it('should execute a search with the name of the selected offer on hit click', async () => {
    const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
    await fireEvent.press(getByTestId('autocompleteItem'))

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: hit.query,
        offerCategories: mockSearchState.offerCategories,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        view: SearchView.Results,
        searchId,
      })
    )
  })

  it('should log a search with the query and selected filters', async () => {
    const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
    await fireEvent.press(getByTestId('autocompleteItem'))

    expect(analytics.logSearchQuery).toHaveBeenCalledWith(
      hit.query,
      ['Localisation', 'Catégories'],
      searchId
    )
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
    await fireEvent.press(getByTestId('autocompleteItem'))

    expect(mockSendEvent).toHaveBeenCalled()
  })
})
