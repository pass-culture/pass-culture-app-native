import React from 'react'

import * as useMinimalBuildNumberModule from 'features/forceUpdate/queries/useMinimalBuildNumberQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

import { ForceUpdateWithResetErrorBoundary } from './ForceUpdateWithResetErrorBoundary'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/forceUpdate/queries/useMinimalBuildNumberQuery')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ForceUpdateWithResetErrorBoundary/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should match snapshot', () => {
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumberQuery').mockReturnValueOnce({
      minimalBuildNumber: 10_304_000,
      isLoading: false,
      error: null,
    })

    render(<ForceUpdateWithResetErrorBoundary resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })
})
