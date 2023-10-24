import React from 'react'

import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { Profile } from './Profile'

jest.mock('react-query')

describe('<Profile/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Profile />)
      const results = await checkAccessibilityFor(container, {
        // TODO(PC-19659): Fix FilterSwitch accessibility errors
        rules: {
          'aria-toggle-field-name': { enabled: false },
          'duplicate-id-aria': { enabled: false },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  it('should not display app share banner', () => {
    render(<Profile />)

    expect(screen.queryByText('Partage le pass Culture')).not.toBeInTheDocument()
  })
})
