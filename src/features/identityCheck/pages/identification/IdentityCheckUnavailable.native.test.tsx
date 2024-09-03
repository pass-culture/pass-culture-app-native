import React from 'react'

import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<IdentityCheckUnavailable />', () => {
  it('should render correctly', () => {
    render(<IdentityCheckUnavailable />)

    expect(screen).toMatchSnapshot()
  })
})
