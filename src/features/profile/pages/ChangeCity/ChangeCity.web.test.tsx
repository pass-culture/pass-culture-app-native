import React from 'react'

import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<ChangeCity/>', () => {
  it('should render correctly', () => {
    const { container } = render(<ChangeCity />)

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ChangeCity />)

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour la ville')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
