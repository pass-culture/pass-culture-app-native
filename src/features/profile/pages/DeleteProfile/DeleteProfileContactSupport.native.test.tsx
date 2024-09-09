import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileContactSupport } from './DeleteProfileContactSupport'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileContactSupport', () => {
  it('should render correctly', () => {
    render(<DeleteProfileContactSupport />)

    expect(screen).toMatchSnapshot()
  })
})
