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
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockUseOffer = jest.fn()
mockUseOffer.mockReturnValue({
  data: {
    ...mockOffer,
    subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    extraData: { performer: 'Céline Dion, Sia' },
  },
})
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

useRoute.mockReturnValue({
  params: {
    fromOfferId: 1,
  },
})

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const spyUseArtistResults = jest.spyOn(useArtistResults, 'useArtistResults')

const mockArtist = {
  name: 'Céline Dion',
  bio: 'chanteuse',
}

describe('<ArtistBody />', () => {
  beforeEach(() => {
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

  it('should call goBack when pressing the back button', () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody offer={offerResponseSnap} subcategory={mockSubcategory} artist={mockArtist} />
      )
    )
    const backButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(backButton)

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
