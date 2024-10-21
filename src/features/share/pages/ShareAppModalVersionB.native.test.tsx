import React from 'react'

import { render, screen } from 'tests/utils'

import { ShareAppModalVersionB } from './ShareAppModalVersionB'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

describe('ShareAppModalVersionB', () => {
  it('should match snapshot', () => {
    render(<ShareAppModalVersionB visible close={jest.fn()} share={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })
})
