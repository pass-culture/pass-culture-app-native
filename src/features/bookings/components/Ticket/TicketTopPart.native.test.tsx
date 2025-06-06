import React from 'react'

import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const offer = mockBuilder.bookingOfferResponse()

describe('TicketTopPart', () => {
  it('should display duo block when offer is duo', async () => {
    renderTicketTopPart({ isDuo: true })

    expect(screen.getByText('Pour deux personnes')).toBeOnTheScreen()
  })

  it('should not display duo block when offer is not duo', async () => {
    renderTicketTopPart({})

    expect(screen.queryByText('Pour deux personnes')).not.toBeOnTheScreen()
  })

  it('should display day block when offer has a day', async () => {
    renderTicketTopPart({ day: '20 mars 2025' })

    expect(screen.getByText('20 mars 2025')).toBeOnTheScreen()
  })

  it('should not display day block when offer has no day', async () => {
    renderTicketTopPart({})

    expect(screen.queryByText('20 mars 2025')).not.toBeOnTheScreen()
  })

  it('should display hour block when offer has an hour', async () => {
    renderTicketTopPart({ hour: '18h56' })

    expect(screen.getByText('18h56')).toBeOnTheScreen()
  })

  it('should not display hour block when offer has no hour', async () => {
    renderTicketTopPart({})

    expect(screen.queryByText('18h56')).not.toBeOnTheScreen()
  })
})

const renderTicketTopPart = ({
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
      <TicketTopPart
        isDuo={isDuo}
        day={day}
        hour={hour}
        title="Toto au cirque"
        offer={offer}
        mapping={subcategoriesMappingSnap as SubcategoriesMapping}
      />
    )
  )
}
