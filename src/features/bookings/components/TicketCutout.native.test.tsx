import React from 'react'

import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { render, screen } from 'tests/utils'
import { TypoDS } from 'ui/theme'

describe('TicketCutout', () => {
  it('should display duo block if offer is duo', async () => {
    render(
      <TicketCutout title="Super spectacle" hour="18h56" day="20 mars 2025" isDuo>
        <TypoDS.Body>Partie basse du ticket</TypoDS.Body>
      </TicketCutout>
    )

    expect(screen.getByText('Pour deux personnes')).toBeOnTheScreen()
  })

  it('should display day block if offer has a day', async () => {
    render(
      <TicketCutout title="Super spectacle" hour="18h56" day="20 mars 2025">
        <TypoDS.Body>Partie basse du ticket</TypoDS.Body>
      </TicketCutout>
    )

    expect(screen.getByText('20 mars 2025')).toBeOnTheScreen()
  })

  it('should display hour block if offer has an hour', async () => {
    render(
      <TicketCutout title="Super spectacle" hour="18h56" day="20 mars 2025">
        <TypoDS.Body>Partie basse du ticket</TypoDS.Body>
      </TicketCutout>
    )

    expect(screen.getByText('18h56')).toBeOnTheScreen()
  })
})
