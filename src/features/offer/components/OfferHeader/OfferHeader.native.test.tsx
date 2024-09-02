import React from 'react'
import { Animated, Share } from 'react-native'

import { OfferResponseV2, PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import {
  hideSnackBar,
  showErrorSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { OfferHeader } from '../OfferHeader/OfferHeader'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
const mockShare = jest.spyOn(Share, 'share').mockImplementation(jest.fn())

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))
const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

mockedUseSnackBarContext.mockReturnValue({
  hideSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
  showErrorSnackBar,
})

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OfferHeader />', () => {
  it('should render all the icons', async () => {
    renderOfferHeader()
    await act(async () => {})

    expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-share')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-favorite')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', async () => {
    renderOfferHeader()
    await act(async () => {})

    fireEvent.press(await screen.findByTestId('animated-icon-back'))

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

    await waitFor(() => {
      expect(screen.getByTestId('offerHeaderName').props.accessibilityHidden).toBe(false)
      expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
    })
  })

  it('should log analytics when clicking on the share button', async () => {
    renderOfferHeader()

    const shareButton = screen.getByLabelText('Partager')
    await act(async () => {
      fireEvent.press(shareButton)
    })

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      offerId: mockOffer.id,
    })
  })

  it('should share when clicking on the share button', async () => {
    renderOfferHeader()

    const shareButton = screen.getByLabelText('Partager')
    await act(async () => {
      fireEvent.press(shareButton)
    })

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

const mockOffer = offerResponseSnap

function renderOfferHeader() {
  mockServer.getApi<PaginatedFavoritesResponse>('/v1/me/favorites', paginatedFavoritesResponseSnap)
  mockServer.getApi<OfferResponseV2>(`/v1/offer/${mockOffer.id}`, offerResponseSnap)

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
  return { animatedValue }
}
