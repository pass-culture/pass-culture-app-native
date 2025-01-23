import React from 'react'

import { render, screen } from 'tests/utils'

import { ForceUpdateWithResetErrorBoundary } from './ForceUpdateWithResetErrorBoundary'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber/useMinimalBuildNumber')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ForceUpdateWithResetErrorBoundary/>', () => {
  it('should match snapshot', async () => {
    await render(<ForceUpdateWithResetErrorBoundary resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })
})
