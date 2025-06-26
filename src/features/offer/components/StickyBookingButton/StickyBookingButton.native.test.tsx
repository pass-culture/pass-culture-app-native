import React from 'react'

import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')

describe('<StickyBookingButton />', () => {
  const mockCtaWordingAndAction = {
    wording: 'Réserver l’offre',
    onPress: jest.fn(),
    navigateTo: undefined,
    externalNav: undefined,
    isDisabled: false,
    bottomBannerText: 'Attention !',
  }

  it('should display the correct wording "Réserver l’offre"', () => {
    render(<StickyBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    expect(screen.getByText('Réserver l’offre')).toBeOnTheScreen()
  })

  it('should display the blurry style', () => {
    render(<StickyBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    expect(screen.getByTestId('blurry-wrapper')).toHaveStyle({ backgroundColor: 'transparent' })
  })

  it('should not display the blurry style if no wording', () => {
    render(
      <StickyBookingButton
        ctaWordingAndAction={{
          onPress: jest.fn(),
          navigateTo: undefined,
          externalNav: undefined,
          isDisabled: false,
          bottomBannerText: 'Attention !',
        }}
      />
    )
    const blurryWrapper = screen.queryByTestId('blurry-wrapper')

    expect(blurryWrapper).not.toBeOnTheScreen()
  })

  it('should display the bottom banner text', () => {
    render(<StickyBookingButton ctaWordingAndAction={mockCtaWordingAndAction} />)

    const bottomBanner = screen.getByText('Attention !')

    expect(bottomBanner).toBeOnTheScreen()
  })

  it('should display the button disabled', () => {
    const disabledCtaWordingAndAction = { ...mockCtaWordingAndAction, isDisabled: true }
    render(<StickyBookingButton ctaWordingAndAction={disabledCtaWordingAndAction} />)

    expect(screen.getByText('Réserver l’offre')).toHaveStyle({
      color: theme.designSystem.color.text.disabled,
    })
  })

  it("shouldn't return the button when it hasn't wording", () => {
    const withoutWording = { ...mockCtaWordingAndAction, wording: undefined }
    render(<StickyBookingButton ctaWordingAndAction={withoutWording} />)

    expect(screen.queryByText('Réserver l’offre')).toBeNull()
  })

  it("shouldn't return the bottom banner when it is undefined", () => {
    const withoutBottomBanner = { ...mockCtaWordingAndAction, bottomBannerText: undefined }
    render(<StickyBookingButton ctaWordingAndAction={withoutBottomBanner} />)

    expect(screen.queryByText('Attention !')).toBeNull()
  })
})
