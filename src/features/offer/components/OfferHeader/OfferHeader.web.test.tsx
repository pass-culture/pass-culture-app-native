import React from 'react'
import { Animated } from 'react-native'

import { PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils/web'

import { OfferHeader } from '../OfferHeader/OfferHeader'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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
    const user = userEvent.setup()
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
      await user.click(shareButton)
    })

    expect(await screen.findByText('Partager l’offre')).toBeInTheDocument()
  })
})
