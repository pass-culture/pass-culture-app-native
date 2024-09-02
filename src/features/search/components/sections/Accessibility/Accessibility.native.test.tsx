import React from 'react'

import { Accessibility } from 'features/search/components/sections/Accessibility/Accessibility'
import { render } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Accessibility />)).toMatchSnapshot()
  })
})
