import React from 'react'

import { render, screen } from 'tests/utils'

import { ShareAppModalVersionA } from './ShareAppModalVersionA'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

describe('ShareAppModalVersionA', () => {
  it('should match snapshot', () => {
    render(<ShareAppModalVersionA visible close={jest.fn()} share={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })
})
