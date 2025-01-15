import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { ForceUpdate } from './ForceUpdate'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber/useMinimalBuildNumber')

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
