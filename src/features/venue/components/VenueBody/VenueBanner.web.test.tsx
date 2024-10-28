import React from 'react'

import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const mockHandleImagePress = jest.fn()

describe('<VenueBanner />', () => {
  it('should not handle venue image press when pressing image not from Google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: false, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByTestId('venueImage'))

    expect(mockHandleImagePress).not.toHaveBeenCalled()
  })

  it('should not handle venue image press when pressing image from Google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: true, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByTestId('venueImageWithGoogleWatermark'))

    expect(mockHandleImagePress).not.toHaveBeenCalled()
  })
})
