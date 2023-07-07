import React from 'react'
import { act } from 'react-dom/test-utils'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ChangePassword } from './ChangePassword'

jest.mock('react-query')

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ChangePassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ChangePassword />)
      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
