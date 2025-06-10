import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { Artist } from 'features/artist/pages/Artist'
import * as useGoBack from 'features/navigation/useGoBack'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/analytics/analytics')

describe('<Artist />', () => {
  useRoute.mockReturnValue({
    params: {
      id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
    },
  })

  describe('When enablePageArtist feature flag activated', () => {
    beforeAll(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
    })

    it('should display artist page content', async () => {
      mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
      render(reactQueryProviderHOC(<Artist />))

      expect((await screen.findAllByText('Avril Lavigne'))[0]).toBeOnTheScreen()
    })

    it('should render null when there is no artist', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        responseOptions: {
          statusCode: 400,
          data: {},
        },
      })
      render(reactQueryProviderHOC(<Artist />))

      await act(async () => {})

      expect(screen.toJSON()).toBeNull()
    })
  })

  describe('When enablePageArtist feature flag deactivated', () => {
    beforeAll(() => {
      setFeatureFlags()
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    })

    it('should render null', async () => {
      render(reactQueryProviderHOC(<Artist />))

      await act(async () => {})

      expect(screen.toJSON()).toBeNull()
    })
  })
})
