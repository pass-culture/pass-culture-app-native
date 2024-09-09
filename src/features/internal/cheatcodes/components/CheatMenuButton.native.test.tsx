import React from 'react'

import { CheatMenuButton } from 'features/internal/cheatcodes/components/CheatMenuButton'
import { env } from 'libs/environment'
import { act, render, screen } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('CheatMenuButton', () => {
  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    render(<CheatMenuButton />)
    await act(async () => {})

    expect(await screen.findByText('CheatMenu')).toBeOnTheScreen()
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    render(<CheatMenuButton />)
    await act(async () => {})

    expect(screen.queryByText('CheatMenu')).not.toBeOnTheScreen()
  })
})
