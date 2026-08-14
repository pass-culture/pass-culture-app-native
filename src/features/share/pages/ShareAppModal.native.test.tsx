import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

import { ShareAppModal } from './ShareAppModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ShareAppModal', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should match snapshot', () => {
    render(<ShareAppModal visible close={jest.fn()} share={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })
})
