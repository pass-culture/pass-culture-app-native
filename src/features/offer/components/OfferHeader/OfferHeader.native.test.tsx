import React, { ReactElement } from 'react'
import { Animated, Share } from 'react-native'

import { OfferResponseV2, PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, userEvent, render, screen } from 'tests/utils'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'

import { OfferHeader } from '../OfferHeader/OfferHeader'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
const mockShare = jest.spyOn(Share, 'share').mockImplementation(jest.fn())

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.useFakeTimers()
const user = userEvent.setup()

describe('<OfferHeader />', () => {
  it('should render all basic icons', async () => {
    renderOfferHeader()

    expect(screen.getByLabelText('Revenir en arrière')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-share')).toBeOnTheScreen()
  })

  it('should render basic icons + optional icons', async () => {
    renderOfferHeader(
      <FavoriteButton
        offerId={123}
        addFavorite={jest.fn()}
        isAddFavoriteLoading
        animationState={{
          iconBackgroundColor: {} as Animated.AnimatedInterpolation<string>,
          iconBorderColor: {} as Animated.AnimatedInterpolation<string>,
          transition: {
            interpolate: jest.fn(),
          } as unknown as Animated.AnimatedInterpolation<number>,
        }}
        removeFavorite={jest.fn()}
        isRemoveFavoriteLoading={false}
      />
    )

    expect(screen.getByLabelText('Revenir en arrière')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-share')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-favorite')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', async () => {
    renderOfferHeader()

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue } = renderOfferHeader()

    expect(screen.getByTestId('offerHeaderName').props.accessibilityHidden).toBeTruthy()
    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })

    expect(screen.getByTestId('offerHeaderName').props.accessibilityHidden).toBe(false)
    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  it('should log analytics when clicking on the share button', async () => {
    renderOfferHeader()

    const shareButton = screen.getByLabelText('Partager')

    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      offerId: offerResponseSnap.id,
    })
  })

  it('should share when clicking on the share button', async () => {
    renderOfferHeader()

    const shareButton = screen.getByLabelText('Partager')

    await user.press(shareButton)

    expect(mockShare).toHaveBeenCalledWith(
      {
        message:
          'Retrouve "Sous les étoiles de Paris - VF" chez "PATHE BEAUGRENELLE" sur le pass Culture\u00a0:\n',
        url: 'https://webapp-v2.example.com/offre/116656?utm_gen=product&utm_campaign=share_offer&utm_medium=header',
      },
      { subject: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!' }
    )
  })
})

function renderOfferHeader(children?: ReactElement | null) {
  mockServer.getApi<PaginatedFavoritesResponse>('/v1/me/favorites', paginatedFavoritesResponseSnap)
  mockServer.getApi<OfferResponseV2>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

  const animatedValue = new Animated.Value(0)
  render(
    reactQueryProviderHOC(
      <OfferHeader
        title="Some very nice offer"
        headerTransition={animatedValue}
        offer={offerResponseSnap}>
        {children}
      </OfferHeader>
    )
  )
  return { animatedValue }
}
