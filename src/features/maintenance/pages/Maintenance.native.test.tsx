import React from 'react'

import { render, screen } from 'tests/utils'

import { Maintenance } from './Maintenance'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<Maintenance />', () => {
  it('should match snapshot with default message', async () => {
    await render(<Maintenance />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with custom message', async () => {
    await render(<Maintenance message="C’est tout cassé&nbsp;! Reviens plus tard" />)

    expect(screen).toMatchSnapshot()
  })
})
