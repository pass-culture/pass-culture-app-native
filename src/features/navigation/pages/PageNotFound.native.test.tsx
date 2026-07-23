import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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

  it('should display remote illustration when new vision UI FF is activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(<PageNotFound />)

    expect(screen.getByTestId('generic-info-page-remote-illustration')).toBeOnTheScreen()
  })
})
