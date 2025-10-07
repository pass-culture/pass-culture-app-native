import React from 'react'

import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { render, screen, userEvent } from 'tests/utils'

const mockHandleImagePress = jest.fn()
const user = userEvent.setup()

jest.useFakeTimers()

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

  it('should handle venue image press when pressing image not from Google', async () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: false, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    await user.press(
      screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo')
    )

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })

  it('should handle venue image press when pressing image from Google', async () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: true, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    await user.press(
      screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo')
    )

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })
})
