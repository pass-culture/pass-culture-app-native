import React from 'react'

import { SetEmail } from 'features/auth/signup/SetEmail'
import { fireEvent, render } from 'tests/utils/web'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<SetEmail />', () => {
  describe('Accessibility', () => {
    it('should check checkbox on spacebar press', async () => {
      const { getByRole } = render(<SetEmail {...props} />)

      const newsletterCheckbox = getByRole('checkbox')
      fireEvent.focus(newsletterCheckbox)
      fireEvent.keyDown(newsletterCheckbox, { key: 'Spacebar' })

      expect(newsletterCheckbox.getAttribute('aria-checked')).toBe('true')
    })

    it('should uncheck checkbox on second spacebar press', async () => {
      const { getByRole } = render(<SetEmail {...props} />)

      const newsletterCheckbox = getByRole('checkbox')
      fireEvent.focus(newsletterCheckbox)
      fireEvent.keyDown(newsletterCheckbox, { key: 'Spacebar' })
      fireEvent.keyDown(newsletterCheckbox, { key: 'Spacebar' })

      expect(newsletterCheckbox.getAttribute('aria-checked')).toBe('false')
    })
  })
})
