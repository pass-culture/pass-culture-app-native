import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useArtistResultsAPI from 'features/offer/queries/useArtistResultsQuery'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockUseOfferQuery = jest.fn()
mockUseOfferQuery.mockReturnValue({
  data: {
    ...mockOffer,
    subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    artists: [
      { id: '1', name: 'Céline Dion' },
      { id: '2', name: 'Sia' },
    ],
  },
})
jest.mock('queries/offer/useOfferQuery', () => ({
  useOffer: () => mockUseOfferQuery(),
}))

useRoute.mockReturnValue({
  params: {
    fromOfferId: 1,
  },
})

const spyUseArtistResults = jest.spyOn(useArtistResultsAPI, 'useArtistResultsQuery')

const mockArtist = {
  id: '1',
  name: 'Céline Dion',
  bio: 'chanteuse',
}

jest.useFakeTimers()

describe('<ArtistBody />', () => {
  beforeEach(() => {
    setFeatureFlags()
    spyUseArtistResults.mockReturnValue({
      artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
      artistPlaylist: [],
    })
  })

  it('should display only the main artist when there are several artists on header title', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody artist={mockArtist} artistPlaylist={[]} artistTopOffers={[]} />
      )
    )

    await screen.findAllByText('Céline Dion')

    expect(screen.getAllByText('Céline Dion')[0]).toBeOnTheScreen()
  })

  it('should call goBack when pressing the back button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody artist={mockArtist} artistPlaylist={[]} artistTopOffers={[]} />
      )
    )
    const backButton = screen.getByTestId('Revenir en arrière')
    await userEvent.setup().press(backButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display correct artist avatar', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={{
            ...mockArtist,
            image: '/passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/998Q',
          }}
          artistPlaylist={[]}
          artistTopOffers={[]}
        />
      )
    )
    await waitFor(() => {
      expect(screen.getByLabelText('artist avatar')).toBeOnTheScreen()
    })
  })

  it('should display default artist avatar when artist has not image', async () => {
    spyUseArtistResults.mockReturnValueOnce({
      artistTopOffers: [],
      artistPlaylist: [],
    })
    render(
      reactQueryProviderHOC(
        <ArtistBody artist={mockArtist} artistPlaylist={[]} artistTopOffers={[]} />
      )
    )

    expect(await screen.findByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should display artist description', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody artist={mockArtist} artistPlaylist={[]} artistTopOffers={[]} />
      )
    )

    await screen.findAllByText('Quelques infos à son sujet')

    expect(screen.getByText('Quelques infos à son sujet')).toBeOnTheScreen()
    expect(screen.getByText('chanteuse')).toBeOnTheScreen()
  })
})
