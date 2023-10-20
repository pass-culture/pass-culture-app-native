import React from 'react'

import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { render, screen } from 'tests/utils'

describe('RecommendedPaths', () => {
  it('should render correctly', () => {
    render(<RecommendedPaths />)
    expect(screen).toMatchSnapshot()
  })
})
