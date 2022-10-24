import React from 'react'
import { Animated } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, waitFor } from 'tests/utils/web'

import { OfferHeader } from '../OfferHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<OfferHeader />', () => {
  it('should fully display the title at the end of the animation', () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))

    const animatedValue = new Animated.Value(0)
    const offerId = 116656

    const { getByTestId } = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <OfferHeader
          title="Some very nice offer"
          headerTransition={animatedValue}
          offerId={offerId}
        />
      )
    )

    expect(getByTestId('offerHeaderName').style.opacity).toBe('0')
    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    })
    waitFor(() => expect(getByTestId('offerHeaderName').style.opacity).toBe('1'))
  })
})
