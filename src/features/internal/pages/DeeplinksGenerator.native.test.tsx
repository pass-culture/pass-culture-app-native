import React from 'react'

import { DeeplinksGenerator } from 'features/internal/pages/DeeplinksGenerator'
import { render } from 'tests/utils'

jest.mock('libs/packageJson', () => ({ getAppBuildVersion: () => 1001005 }))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('queries/subcategories/useSubcategoriesQuery')

describe('<DeeplinksGenerator />', () => {
  it('should render DeeplinksGenerator', () => {
    expect(render(<DeeplinksGenerator />)).toMatchSnapshot()
  })
})
