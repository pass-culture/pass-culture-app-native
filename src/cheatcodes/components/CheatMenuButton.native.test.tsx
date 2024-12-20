import React from 'react'

import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { env } from 'libs/environment'
import { act, render, screen } from 'tests/utils'

describe('CheatMenuButton', () => {
  it('should have Cheatcodes button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    render(<CheatMenuButton />)
    await act(async () => {})

    expect(await screen.findByText('Cheatcodes')).toBeOnTheScreen()
  })

  it('should NOT have Cheatcodes button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    render(<CheatMenuButton />)
    await act(async () => {})

    expect(screen.queryByText('Cheatcodes')).not.toBeOnTheScreen()
  })
})
