import React from 'react'

import { render, checkAccessibilityFor, waitFor, screen } from 'tests/utils/web'

import { ChangeEmail } from './ChangeEmail'

jest.mock('react-query')

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ChangeEmail/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ChangeEmail />)

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
