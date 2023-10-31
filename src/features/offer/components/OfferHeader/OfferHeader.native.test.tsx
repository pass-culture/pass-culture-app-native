import { rest } from 'msw'
import React from 'react'
import { Animated } from 'react-native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { OfferHeader } from '../OfferHeader/OfferHeader'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

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

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<OfferHeader />', () => {
  it('should render all the icons', async () => {
    renderOfferHeader()
    await act(async () => {})

    expect(screen.queryByTestId('animated-icon-back')).toBeOnTheScreen()
    expect(screen.queryByTestId('animated-icon-share')).toBeOnTheScreen()
    expect(screen.queryByTestId('animated-icon-favorite')).toBeOnTheScreen()
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
      offerId,
    })
  })
})

const offerId = 116656

function renderOfferHeader() {
  server.use(
    rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${offerId}`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    )
  )

  const animatedValue = new Animated.Value(0)
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferHeader
        title="Some very nice offer"
        headerTransition={animatedValue}
        offerId={offerId}
      />
    )
  )
  return { animatedValue }
}
