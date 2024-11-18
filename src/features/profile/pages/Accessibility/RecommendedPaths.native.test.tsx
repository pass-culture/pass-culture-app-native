import React from 'react'

import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('RecommendedPaths', () => {
  it('should render correctly', () => {
    render(<RecommendedPaths />)

    expect(screen).toMatchSnapshot()
  })
})
