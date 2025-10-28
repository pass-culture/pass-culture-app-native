import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
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

jest.useFakeTimers()

describe('<ArtistBody />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display only the main artist when there are several artists on header title', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await screen.findAllByText('Avril Lavigne')

    expect(screen.getAllByText('Avril Lavigne')[0]).toBeOnTheScreen()
  })

  it('should call goBack when pressing the back button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
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
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )
    await waitFor(() => {
      expect(screen.getByLabelText('artist avatar')).toBeOnTheScreen()
    })
  })

  it('should display default artist avatar when artist has not image', async () => {
    const artist = {
      ...mockArtist,
      image: undefined,
    }
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={artist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should display artist description', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByText('À propos')).toBeOnTheScreen()
    expect(screen.getByText('Chanteuse canadienne.')).toBeOnTheScreen()
  })
})
