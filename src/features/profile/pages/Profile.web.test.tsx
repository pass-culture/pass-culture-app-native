import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { Profile } from './Profile'

jest.mock('react-query')

describe('<Profile />', () => {
  it('should not have basic accessibility issues', async () => {
    const renderAPI = render(<Profile />)
    const results = await checkAccessibilityFor(renderAPI.container, {
      rules: {
        'duplicate-id-aria': { enabled: false }, // error: "IDs used in ARIA and labels must be unique (duplicate-id-aria)"
      },
    })

    expect(results).toHaveNoViolations()
  })

  it('should not render "Comment ça marche"', () => {
    const { queryByText } = render(<Profile />)
    const row = queryByText('Comment ça marche\u00a0?')

    expect(row).toBeNull()
  })
})
