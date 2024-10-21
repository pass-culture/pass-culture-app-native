import React from 'react'

import { render, screen } from 'tests/utils'

import { ShareAppModal } from './ShareAppModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ShareAppModal', () => {
  it('should match snapshot', () => {
    render(<ShareAppModal visible close={jest.fn()} share={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })
})
