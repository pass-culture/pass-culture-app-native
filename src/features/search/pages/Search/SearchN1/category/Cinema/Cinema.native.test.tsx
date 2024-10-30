import React from 'react'

import * as useCinemaOffers from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/useCinemaOffers'
import { Cinema } from 'features/search/pages/Search/SearchN1/category/Cinema/Cinema'
import {
  cinemaPlaylistAlgoliaSnapshot,
  cinemaPlaylistAlgoliaSnapshotWithoutHits,
} from 'features/search/pages/Search/SearchN1/category/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

const mockUseCinemaOffers = jest.spyOn(useCinemaOffers, 'useCinemaOffers')
mockUseCinemaOffers.mockReturnValue({
  isLoading: false,
  offers: cinemaPlaylistAlgoliaSnapshot,
})

describe('Cinema', () => {
  it('should render playlist when algolia returns offers', async () => {
    renderCinema()

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    mockUseCinemaOffers.mockReturnValueOnce({
      isLoading: false,
      offers: cinemaPlaylistAlgoliaSnapshotWithoutHits,
    })
    renderCinema()

    expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<Cinema />))
