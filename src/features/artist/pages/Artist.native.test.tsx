import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { Artist } from 'features/artist/pages/Artist'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/components/CollapsibleText/CollapsibleText')

const user = userEvent.setup()

describe('<Artist />', () => {
  useRoute.mockReturnValue({
    params: {
      id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
    },
  })

  describe('When enablePageArtist feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
      mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
    })

    it('should display artist page content', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
      render(reactQueryProviderHOC(<Artist />))

      expect((await screen.findAllByText('Avril Lavigne'))[0]).toBeOnTheScreen()
    })

    it('should trigger ClickExpandArtistBio log when pressing Voir plus button', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
      render(reactQueryProviderHOC(<Artist />))

      const seeMoreButton = await screen.findByText('Voir plus')
      await user.press(seeMoreButton)

      expect(analytics.logClickExpandArtistBio).toHaveBeenNthCalledWith(1, {
        artistId: mockArtist.id,
        artistName: mockArtist.name,
        from: 'artist',
      })
    })

    it('should render null when there is no artist', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        responseOptions: {
          statusCode: 404,
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
