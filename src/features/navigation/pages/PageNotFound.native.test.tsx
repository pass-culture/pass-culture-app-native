import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

import { PageNotFound } from './PageNotFound'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<PageNotFound/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(<PageNotFound />)

    expect(screen).toMatchSnapshot()
  })
})
