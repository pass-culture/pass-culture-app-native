import React from 'react'

import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

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
