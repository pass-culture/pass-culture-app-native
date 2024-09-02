import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { ForceUpdate } from './ForceUpdate'

jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<ForceUpdate/>', () => {
  it('should not display the web app button', () => {
    render(<ForceUpdate resetErrorBoundary={() => null} />)

    const goToWebappButton = screen.queryByText('Utiliser la version web')

    expect(goToWebappButton).not.toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ForceUpdate resetErrorBoundary={() => null} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
