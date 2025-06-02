import React from 'react'

import { TicketCutoutContent } from 'features/bookings/components/TicketCutout/TicketCutoutContent'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

describe('TicketCutoutContent', () => {
  it('should display duo block when offer is duo', async () => {
    renderTicketCutoutContent({ isDuo: true })

    expect(screen.getByText('Pour deux personnes')).toBeOnTheScreen()
  })

  it('should not display duo block when offer is not duo', async () => {
    renderTicketCutoutContent({})

    expect(screen.queryByText('Pour deux personnes')).not.toBeOnTheScreen()
  })

  it('should display day block when offer has a day', async () => {
    renderTicketCutoutContent({ day: '20 mars 2025' })

    expect(screen.getByText('20 mars 2025')).toBeOnTheScreen()
  })

  it('should not display day block when offer has no day', async () => {
    renderTicketCutoutContent({})

    expect(screen.queryByText('20 mars 2025')).not.toBeOnTheScreen()
  })

  it('should display hour block when offer has an hour', async () => {
    renderTicketCutoutContent({ hour: '18h56' })

    expect(screen.getByText('18h56')).toBeOnTheScreen()
  })

  it('should not display hour block when offer has no hour', async () => {
    renderTicketCutoutContent({})

    expect(screen.queryByText('18h56')).not.toBeOnTheScreen()
  })
})

const renderTicketCutoutContent = ({
  hour,
  day,
  isDuo,
}: {
  hour?: string
  day?: string
  isDuo?: boolean
}) => {
  return render(
    reactQueryProviderHOC(
      <TicketCutoutContent
        title="Super spectacle"
        hour={hour}
        day={day}
        isDuo={isDuo}
        offer={bookingsSnap.ongoing_bookings[0].stock.offer}
        mapping={subcategoriesMappingSnap as SubcategoriesMapping}>
        <Typo.Body>Partie basse du ticket</Typo.Body>
      </TicketCutoutContent>
    )
  )
}
