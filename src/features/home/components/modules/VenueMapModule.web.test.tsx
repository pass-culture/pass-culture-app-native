import React from 'react'

import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import { render, screen } from 'tests/utils/web'

describe('VenueMapModule', () => {
  it('should not display venue map block when is "web"', () => {
    render(<VenueMapModule />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
