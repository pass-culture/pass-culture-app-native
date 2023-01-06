import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ChangeEmail } from './ChangeEmail'

jest.mock('react-query')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

describe('<ChangeEmail/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4.mockReturnValueOnce('emailInput').mockReturnValueOnce('passwordInput')
      const { container } = render(<ChangeEmail />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
