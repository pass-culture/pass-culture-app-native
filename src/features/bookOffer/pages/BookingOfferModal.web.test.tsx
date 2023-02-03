import React from 'react'

import { Step } from 'features/bookOffer/context/reducer'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BookingOfferModalComponent } from './BookingOfferModal'

jest.mock('react-query')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/bookOffer/helpers/useBookingStock')

let mockStep: Step | undefined = undefined
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: {
      step: mockStep,
      quantity: 2,
      date: new Date('2021-03-02T20:00:00'),
    },
    dispatch: jest.fn(),
    dismissModal: jest.fn(),
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<BookingOfferModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for step "date"', async () => {
      mockStep = Step.DATE
      const { container } = render(<BookingOfferModalComponent offerId={mockOffer.id} visible />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "hour"', async () => {
      mockStep = Step.HOUR
      const { container } = render(<BookingOfferModalComponent offerId={mockOffer.id} visible />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "duo"', async () => {
      mockStep = Step.DUO
      const { container } = render(<BookingOfferModalComponent offerId={mockOffer.id} visible />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "pre validation"', async () => {
      mockStep = Step.PRE_VALIDATION
      const { container } = render(<BookingOfferModalComponent offerId={mockOffer.id} visible />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "confirmation"', async () => {
      mockStep = Step.CONFIRMATION
      const { container } = render(<BookingOfferModalComponent offerId={mockOffer.id} visible />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for ended used booking', async () => {
      const { container } = render(
        <BookingOfferModalComponent offerId={mockOffer.id} isEndedUsedBooking visible />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
