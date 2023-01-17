import React from 'react'

import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { BookingConfirmation } from './BookingConfirmation'

jest.mock('react-query')

jest.mock('features/user/helpers/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

describe('<BookingConfirmation />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BookingConfirmation />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
