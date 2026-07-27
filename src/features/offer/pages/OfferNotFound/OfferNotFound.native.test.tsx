import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render } from 'tests/utils'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<OfferNotFound />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    expect(
      render(<OfferNotFound error={error} resetErrorBoundary={resetErrorBoundary} />)
    ).toMatchSnapshot()
  })
})
