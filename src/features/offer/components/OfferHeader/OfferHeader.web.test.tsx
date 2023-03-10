import React from 'react'
import { Animated } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils/web'

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

describe('<OfferHeader />', () => {
  it('should fully display the title at the end of the animation', async () => {
    const animatedValue = new Animated.Value(0)
    const offerId = 116656

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

    const offerHeaderName = screen.getByTestId('offerHeaderName')

    expect(offerHeaderName.style.opacity).toBe('0')
    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    })
    await waitFor(() => {
      expect(offerHeaderName.style.opacity).toBe('1')
    })
  })
})
