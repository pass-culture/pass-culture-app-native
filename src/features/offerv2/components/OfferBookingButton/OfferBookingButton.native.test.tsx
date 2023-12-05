import React from 'react'

import { OfferBookingButton } from 'features/offerv2/components/OfferBookingButton/OfferBookingButton'
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

  it("shouldn't return the button when it hasn't wording", () => {
    const withoutWording = { ...mockCtaWordingAndAction, wording: undefined }
    render(<OfferBookingButton ctaWordingAndAction={withoutWording} />)

    expect(screen.queryByText('Réserver l’offre')).toBeNull()
  })

  it("shouldn't return the bottom banner when it is undefined", () => {
    const withoutBottomBanner = { ...mockCtaWordingAndAction, bottomBannerText: undefined }
    render(<OfferBookingButton ctaWordingAndAction={withoutBottomBanner} />)

    expect(screen.queryByText('Attention !')).toBeNull()
  })
})
