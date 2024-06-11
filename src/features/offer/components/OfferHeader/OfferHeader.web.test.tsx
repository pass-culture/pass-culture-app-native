import React from 'react'
import { Animated } from 'react-native'

import { PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils/web'

import { OfferHeader } from '../OfferHeader/OfferHeader'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockImplementation(() => ({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferHeader />', () => {
  beforeEach(() => {
    mockServer.getApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
  })

  it('should fully display the title at the end of the animation', async () => {
    const animatedValue = new Animated.Value(0)

    render(
      reactQueryProviderHOC(
        <OfferHeader
          title="Some very nice offer"
          headerTransition={animatedValue}
          offer={mockOffer}
        />
      )
    )

    const offerHeaderName = screen.getByTestId('offerHeaderName')

    expect(offerHeaderName.style.opacity).toBe('0')

    await act(async () => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    })

    expect(offerHeaderName.style.opacity).toBe('1')
  })

  it('should display the share modal when clicking on the share button', async () => {
    const animatedValue = new Animated.Value(0)

    render(
      reactQueryProviderHOC(
        <OfferHeader
          title="Some very nice offer"
          headerTransition={animatedValue}
          offer={mockOffer}
        />
      )
    )

    const shareButton = screen.getByLabelText('Partager')
    await act(async () => {
      fireEvent.click(shareButton)
    })

    expect(screen.getByText('Partager l’offre')).toBeInTheDocument()
  })
})
