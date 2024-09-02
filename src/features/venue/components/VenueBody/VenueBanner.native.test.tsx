import React from 'react'

import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { render, screen } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<VenueBanner />', () => {
  it('should display the Google watermark if the image is from Google', () => {
    render(<VenueBanner bannerUrl="https://image.com" bannerMeta={{ is_from_google: true }} />)

    expect(screen.getByTestId('googleWatermark')).toBeOnTheScreen()
  })

  it('should not display the Google watermark if the image is not from Google', () => {
    render(<VenueBanner bannerUrl="https://image.com" bannerMeta={{ is_from_google: false }} />)

    expect(screen.queryByTestId('googleWatermark')).not.toBeOnTheScreen()
  })

  it('should display the copyright if the image is from Google and has a credit', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: true, image_credit: 'François Boulo' }}
      />
    )

    expect(screen.getByText('© François Boulo')).toBeOnTheScreen()
  })

  it('should not display the copyright if the image has a credit but is not from Google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: false, image_credit: 'François Boulo' }}
      />
    )

    expect(screen.queryByText('© François Boulo')).not.toBeOnTheScreen()
  })
})
