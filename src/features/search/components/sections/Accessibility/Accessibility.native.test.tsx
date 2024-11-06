import React from 'react'

import { Accessibility } from 'features/search/components/sections/Accessibility/Accessibility'
import { render } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Accessibility />)).toMatchSnapshot()
  })
})
