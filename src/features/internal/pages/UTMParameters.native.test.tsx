import React from 'react'

import { UTMParameters } from 'features/internal/pages/UTMParameters'
import { render, screen } from 'tests/utils'

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
