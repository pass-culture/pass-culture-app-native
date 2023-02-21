import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('react-query')

describe('<RecreditBirthdayNotification/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container, queryByText } = render(<RecreditBirthdayNotification />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
      expect(
        queryByText('Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget')
      ).toBeTruthy()
    })
  })
})
