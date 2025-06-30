import React from 'react'

import * as useMinimalBuildNumberModule from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { render, screen } from 'tests/utils'

import { ForceUpdateWithResetErrorBoundary } from './ForceUpdateWithResetErrorBoundary'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ForceUpdateWithResetErrorBoundary/>', () => {
  it('should match snapshot', () => {
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber').mockReturnValueOnce({
      minimalBuildNumber: 10_304_000,
      isLoading: false,
      error: undefined,
    })

    render(<ForceUpdateWithResetErrorBoundary resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })
})
