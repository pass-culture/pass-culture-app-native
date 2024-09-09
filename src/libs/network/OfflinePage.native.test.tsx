import React from 'react'

import { render, screen } from 'tests/utils'

import { OfflinePage } from './OfflinePage'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OfflinePage />', () => {
  it('should match snapshot with default message', async () => {
    await render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })
})
