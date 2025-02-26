import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useArtistResults from 'features/offer/helpers/useArtistResults/useArtistResults'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

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
    extraData: { performer: 'Céline Dion, Sia' },
  },
})
jest.mock('queries/useOfferQuery/useOfferQuery', () => ({
  useOffer: () => mockUseOfferQuery(),
}))

useRoute.mockReturnValue({
  params: {
    fromOfferId: 1,
  },
})

const spyUseArtistResults = jest.spyOn(useArtistResults, 'useArtistResults')

const mockArtist = {
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

  it('should display only the main artist when there are several artists on header title', () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )

    expect(screen.getAllByText('Céline Dion')[0]).toBeOnTheScreen()
  })

  it('should call goBack when pressing the back button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )
    const backButton = screen.getByTestId('Revenir en arrière')
    await userEvent.setup().press(backButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display correct artist avatar', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )

    await screen.findByLabelText('artist avatar')

    expect(screen.getByLabelText('artist avatar').props.source).toMatchObject({
      uri: mockedAlgoliaOffersWithSameArtistResponse[0].offer.thumbUrl,
    })
  })

  it('should display default artist avatar if there are no top offers', async () => {
    spyUseArtistResults.mockReturnValueOnce({
      artistTopOffers: [],
      artistPlaylist: [],
    })
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )

    expect(await screen.findByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should display artist description', () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )

    expect(screen.getByText('Quelques infos à son sujet')).toBeOnTheScreen()
    expect(screen.getByText('chanteuse')).toBeOnTheScreen()
  })
})
