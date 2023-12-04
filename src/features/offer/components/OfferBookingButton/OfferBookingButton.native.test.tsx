import React from 'react'

import { OfferBookingButton } from 'features/offer/components/OfferBookingButton/OfferBookingButton'
import { render, screen } from 'tests/utils'

describe('<OfferBookingButton />', () => {
  const mockCtaWordingAndAction = {
    wording: 'Réserver l’offre',
    onPress: jest.fn(),
    navigateTo: undefined,
    externalNav: undefined,
    isDisabled: false,
    bottomBannerText: 'Attention !',
  }

  it('should display the correct wording "Réserver l’offre"', () => {
    render(<OfferBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    expect(screen.getByText('Réserver l’offre')).toBeOnTheScreen()
  })

  it('should display the blurry style', () => {
    render(<OfferBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    expect(screen.getByTestId('blurry-wrapper')).toHaveStyle({ backgroundColor: 'transparent' })
  })

  it('should display the bottom banner text', () => {
    render(<OfferBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    const bottomBanner = screen.getByText('Attention !')

    expect(bottomBanner).toBeOnTheScreen()
  })

  it('should display the button disabled', () => {
    const disabledCtaWordingAndAction = { ...mockCtaWordingAndAction, isDisabled: true }
    render(<OfferBookingButton ctaWordingAndAction={disabledCtaWordingAndAction} />)

    expect(screen.getByText('Réserver l’offre')).toHaveStyle({ color: '#696A6F' })
  })

  it("shouldn't return the button if we don't have wording for it", () => {
    const noWording = { ...mockCtaWordingAndAction, wording: undefined }
    render(<OfferBookingButton ctaWordingAndAction={noWording} />)

    expect(screen.queryByText('Réserver l’offre')).toBeNull()
  })
})
