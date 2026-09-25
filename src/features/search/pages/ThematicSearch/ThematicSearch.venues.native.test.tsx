import React from 'react'
import { Button } from 'react-native'

import { useIsFocused, useRoute } from '__mocks__/@react-navigation/native'
import { Activity, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchWrapper, useSearch } from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, within } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/search/pages/ThematicSearch/queries/useThematicSearchPlaylistsQuery', () => ({
  useThematicSearchPlaylistsQuery: () => ({ playlists: [], isLoading: false }),
}))

const mockData = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({ data: mockData }),
}))

const venueResponses = {
  [SearchGroupNameEnumv2.CINEMA]: {
    title: 'Les cinémas',
    name: 'Cinéma de la catégorie',
    activity: Activity.CINEMA,
  },
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    title: 'Les salles de concerts et festivals',
    name: 'Salle de concerts de la catégorie',
    activity: Activity.PERFORMANCE_HALL,
  },
}
const genericVenueName = 'Librairie hors catégorie'
const user = userEvent.setup()
const multipleQueriesSpy = jest.spyOn(multipleQueriesAPI, 'multipleQueries')

// Exercise the same shared-state reset as the search header and the search tab,
// without unmounting the thematic screen.
const ResetSearchButton = () => {
  const { dispatch, searchState } = useSearch()
  return (
    <Button
      title="Réinitialiser la recherche"
      onPress={() =>
        dispatch({
          type: 'SET_STATE',
          payload: { ...initialSearchState, locationFilter: searchState.locationFilter },
        })
      }
    />
  )
}

describe('ThematicSearch venue results', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    setFeatureFlags()
    useIsFocused.mockReturnValue(true)
    useLocationV2.setState(defaultLocationState)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    locationActions.setGeolocPosition({ latitude: 48.85, longitude: 2.35 })
    multipleQueriesSpy.mockImplementation((queries) =>
      Promise.resolve(
        queries.map((request) => {
          const { indexName } = request
          const query = 'query' in request ? request.query : undefined
          if (indexName !== env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH) {
            return { ...mockedAlgoliaResponse, hits: [], nbHits: 0 }
          }
          const response =
            query === SearchGroupNameEnumv2.CINEMA ||
            query === SearchGroupNameEnumv2.CONCERTS_FESTIVALS
              ? venueResponses[query]
              : undefined
          return {
            ...mockedAlgoliaVenueResponse,
            hits: mockedAlgoliaVenueResponse.hits.slice(0, 2).map((venue, index) => ({
              ...venue,
              name: `${response?.name ?? genericVenueName} ${index + 1}`,
              activity: response?.activity ?? Activity.BOOKSTORE,
            })),
            nbHits: 2,
            userData: response ? [{ venue_playlist_title: response.title }] : [],
          }
        })
      )
    )
  })

  it.each([SearchGroupNameEnumv2.CINEMA, SearchGroupNameEnumv2.CONCERTS_FESTIVALS] as const)(
    'should keep the %s venues and title after three shared-search resets',
    async (category) => {
      useRoute.mockReturnValue({
        name: 'ThematicSearch',
        params: { offerCategories: [category] },
      })
      const { rerender } = render(<ThematicSearch />, {
        wrapper: ({ children }) =>
          reactQueryProviderHOC(
            <SearchWrapper>
              <React.Fragment>
                <ResetSearchButton />
                {children}
              </React.Fragment>
            </SearchWrapper>
          ),
      })
      const { title, name } = venueResponses[category]

      expect(await screen.findByText(`${title} près de toi`)).toBeOnTheScreen()
      expect(screen.getByText(`${name} 1`)).toBeOnTheScreen()
      expect(screen.getByText(`${name} 2`)).toBeOnTheScreen()

      for (let cycle = 0; cycle < 3; cycle++) {
        useIsFocused.mockReturnValue(false)
        rerender(<ThematicSearch />)
        await user.press(screen.getByText('Réinitialiser la recherche'))
        useIsFocused.mockReturnValue(true)
        rerender(<ThematicSearch />)
        await act(async () => {})

        expect(screen.getByText(`${title} près de toi`)).toBeOnTheScreen()
        expect(
          within(screen.getByTestId('search-venue-list')).getAllByText(new RegExp(name))
        ).toHaveLength(2)
        expect(screen.queryByText(new RegExp(genericVenueName))).not.toBeOnTheScreen()
        expect(screen.queryByText('Les lieux culturels près de toi')).not.toBeOnTheScreen()
      }

      const venueQueries = multipleQueriesSpy.mock.calls.flatMap(([queries]) =>
        queries.filter(({ indexName }) => indexName === env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH)
      )

      expect(venueQueries.length).toBeGreaterThan(0)

      for (const query of venueQueries) {
        expect(query).toEqual(expect.objectContaining({ query: category }))
      }
    }
  )
})
