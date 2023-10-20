import React from 'react'

import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { render, screen } from 'tests/utils'

describe('IdentityCheckPendingBadge', () => {
  it('should display correct message', () => {
    render(<IdentityCheckPendingBadge />)
    expect(screen.queryByText('Ton inscription est en cours de traitement.')).toBeOnTheScreen()
  })
})
