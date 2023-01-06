import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ChangePassword } from './ChangePassword'

jest.mock('react-query')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

describe('<ChangePassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4.mockReturnValueOnce('newPassword').mockReturnValueOnce('oldPassword')
      const { container } = render(<ChangePassword />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
