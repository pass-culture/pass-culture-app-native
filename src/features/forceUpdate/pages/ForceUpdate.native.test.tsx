import React from 'react'

import { render, screen } from 'tests/utils'

import { ForceUpdate } from './ForceUpdate'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ForceUpdate/>', () => {
  it('should match snapshot', async () => {
    render(<ForceUpdate />)

    expect(screen).toMatchSnapshot()
  })
})
