import React from 'react'

import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { render } from 'tests/utils'

describe('RecommendedPaths', () => {
  it('should render correctly', () => {
    const renderAPI = render(<RecommendedPaths />)
    expect(renderAPI).toMatchSnapshot()
  })
})
