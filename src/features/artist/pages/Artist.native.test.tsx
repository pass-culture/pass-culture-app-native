import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { Artist } from 'features/artist/pages/Artist'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useArtistResultsAPI from 'features/offer/queries/useArtistResultsQuery'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const spyUseArtistResults = jest.spyOn(useArtistResultsAPI, 'useArtistResultsQuery')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/analytics/analytics')

describe('<Artist />', () => {
  useRoute.mockReturnValue({
    params: {
      id: '1',
    },
  })

  describe('When enablePageArtist feature flag activated', () => {
    beforeAll(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
    })

    it('should display artist page content', async () => {
      spyUseArtistResults.mockReturnValueOnce({
        artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
        artistPlaylist: [],
      })
      render(reactQueryProviderHOC(<Artist />))

      expect((await screen.findAllByText('Eiichiro Oda'))[0]).toBeOnTheScreen()
    })

    it('should render null when there is no artist', () => {
      spyUseArtistResults.mockReturnValueOnce({
        artistTopOffers: [],
        artistPlaylist: [],
      })
      render(reactQueryProviderHOC(<Artist />))

      expect(screen.toJSON()).toBeNull()
    })
  })

  describe('When enablePageArtist feature flag deactivated', () => {
    beforeAll(() => {
      setFeatureFlags()
    })

    it('should render null', () => {
      spyUseArtistResults.mockReturnValueOnce({
        artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
        artistPlaylist: [],
      })
      render(reactQueryProviderHOC(<Artist />))

      expect(screen.toJSON()).toBeNull()
    })
  })
})
