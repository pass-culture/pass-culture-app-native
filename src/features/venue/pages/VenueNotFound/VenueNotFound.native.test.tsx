import React from 'react'

import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { render } from 'tests/utils'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<VenueNotFound />', () => {
  it('should render correctly', () => {
    expect(
      render(<VenueNotFound error={error} resetErrorBoundary={resetErrorBoundary} />)
    ).toMatchSnapshot()
  })
})
