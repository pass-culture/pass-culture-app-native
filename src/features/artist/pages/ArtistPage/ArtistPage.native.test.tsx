import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import * as useGoBack from 'features/navigation/useGoBack'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'

import { mockArtist } from '../../fixtures/mockArtist'

import { ArtistPage } from './ArtistPage'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('<ArtistPage />', () => {
  useRoute.mockReturnValue({
    params: {
      id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
    },
  })

  describe('When enablePageArtist feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
      mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)

      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    })

    it('should display artist page content', async () => {
      render(reactQueryProviderHOC(<ArtistPage />))

      expect((await screen.findAllByText('Avril Lavigne'))[0]).toBeOnTheScreen()
    })

    it('should display artist description', async () => {
      render(reactQueryProviderHOC(<ArtistPage />))

      expect(await screen.findByText('Chanteuse canadienne.')).toBeOnTheScreen()
    })

    it('should display default artist avatar when artist has no image', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        ...mockArtist,
        image: undefined,
      })

      render(reactQueryProviderHOC(<ArtistPage />))

      expect(await screen.findByTestId('BicolorProfile')).toBeOnTheScreen()
    })

    it('should call goBack when pressing the back button', async () => {
      render(reactQueryProviderHOC(<ArtistPage />))

      const backButton = await screen.findByLabelText('Revenir en arrière')
      const user = userEvent.setup()
      await user.press(backButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should display correct artist avatar', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        ...mockArtist,
        image: '/passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/998Q',
      })

      render(reactQueryProviderHOC(<ArtistPage />))
      await waitFor(() => {
        expect(screen.getByLabelText('image de Avril Lavigne')).toBeOnTheScreen()
      })
    })

    describe('Request status', () => {
      it('should render null when there is and error', async () => {
        mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
          responseOptions: {
            statusCode: 404,
            data: {},
          },
        })
        render(reactQueryProviderHOC(<ArtistPage />))

        expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
      })

      it('should display loading page when loading', async () => {
        mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
          responseOptions: {
            delay: 'infinite',
            statusCode: 200,
            data: {},
          },
        })

        render(reactQueryProviderHOC(<ArtistPage />))

        expect(screen.getByText('Chargement en cours...')).toBeOnTheScreen()

        await act(() => {}) // the components re-render at the end of loading, this test focus on the loading part, ignore the others re-renders
      })
    })
  })

  describe('When enablePageArtist feature flag deactivated', () => {
    beforeAll(() => {
      setFeatureFlags()
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    })

    it('should display page not found', async () => {
      render(reactQueryProviderHOC(<ArtistPage />))

      expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
    })
  })
})
