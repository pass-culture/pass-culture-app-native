import React from 'react'

import { UTMParameters } from 'features/internal/marketingAndCommunication/pages/UTMParameters'
import { render, screen } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<UTMParameters />', () => {
  it('should render correctly', async () => {
    render(<UTMParameters />)
    await screen.findByText('UTM parameters')

    expect(screen).toMatchSnapshot()
  })
})
