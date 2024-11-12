import React from 'react'

import { render, screen } from 'tests/utils'

import { DeleteProfileContactSupport } from './DeleteProfileContactSupport'

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
