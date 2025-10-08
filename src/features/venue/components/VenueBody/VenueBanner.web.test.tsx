import React from 'react'

import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockHandleImagePress = jest.fn()

describe('<VenueBanner />', () => {
  it('should call press handler when pressing image not from google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: false, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo'))

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })

  it('should call press handler when pressing image from google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerMeta={{ is_from_google: true, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByTestId('Voir l’illustration en plein écran - © François Boulo'))

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })

  it('should display default venue background', async () => {
    render(
      <VenueBanner
        bannerMeta={{ is_from_google: true, image_credit: 'François Boulo' }}
        handleImagePress={mockHandleImagePress}
      />
    )

    expect(await screen.findByTestId('defaultVenueBackground')).toBeInTheDocument()
  })
})
