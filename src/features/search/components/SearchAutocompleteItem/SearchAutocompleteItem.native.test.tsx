import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem/SearchAutocompleteItem'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState: SearchState = {
  ...initialSearchState,
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
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
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  } as AlgoliaSuggestionHit

  it('should render SearchAutocompleteItem', () => {
    expect(
      render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} shouldShowCategory />)
    ).toMatchSnapshot()
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
    await fireEvent.press(getByTestId('autocompleteItem'))

    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  describe('when item is not in the first three suggestions', () => {
    it('should execute a search with the query suggestion on hit click', async () => {
      const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
      await fireEvent.press(getByTestId('autocompleteItem'))

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: hit.query,
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      )
    })

    it('should log a search with the query and selected filters on hit click', async () => {
      const { getByTestId } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)
      await fireEvent.press(getByTestId('autocompleteItem'))

      expect(analytics.logPerformSearch).toHaveBeenCalledWith({
        ...initialSearchState,
        query: hit.query,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        view: SearchView.Results,
        searchId,
        isAutocomplete: true,
      })
    })

    it('should not display the most popular category of the query suggestion', async () => {
      const { queryByText } = render(<SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} />)

      expect(queryByText('Films, séries, cinéma')).toBeFalsy()
    })
  })

  describe('when item is in the first three suggestions', () => {
    it('should execute a search with the query suggestion and the most popular category of the query suggestion on hit click', async () => {
      const { getByTestId } = render(
        <SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} shouldShowCategory />
      )
      await fireEvent.press(getByTestId('autocompleteItem'))

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: hit.query,
          offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      )
    })

    it('should log a search with the query, the most popular category of the query suggestion and other selected filters on hit click', async () => {
      const { getByTestId } = render(
        <SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} shouldShowCategory />
      )
      await fireEvent.press(getByTestId('autocompleteItem'))

      expect(analytics.logPerformSearch).toHaveBeenCalledWith({
        ...initialSearchState,
        query: hit.query,
        offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        view: SearchView.Results,
        searchId,
        isAutocomplete: true,
      })
    })

    it('should display the most popular category of the query suggestion', async () => {
      const { queryByText } = render(
        <SearchAutocompleteItem hit={hit} sendEvent={mockSendEvent} shouldShowCategory />
      )

      expect(queryByText('Films, séries, cinéma')).toBeTruthy()
    })
  })
})
