import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { render } from 'tests/utils'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<OfferNotFound />', () => {
  it('should render correctly', () => {
    expect(
      render(<OfferNotFound error={error} resetErrorBoundary={resetErrorBoundary} />)
    ).toMatchSnapshot()
  })
})
