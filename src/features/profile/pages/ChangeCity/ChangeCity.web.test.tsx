import React from 'react'

import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('ChangeCity', () => {
  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<ChangeCity />))

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderAccessibility()

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour la ville')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderAccessibility = async () =>
  act(async () => {
    return render(reactQueryProviderHOC(<ChangeCity />))
  })
