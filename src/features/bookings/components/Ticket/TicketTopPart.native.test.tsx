import React from 'react'

import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const offer = mockBuilder.bookingOfferResponse()
const nonBreakingSpace = '\u00a0'

describe('TicketTopPart', () => {
  it('should display duo block when booking is duo', async () => {
    renderTicketTopPart({ isDuo: true })

    expect(screen.getByText('Pour deux personnes')).toBeOnTheScreen()
  })

  it('should display day block when booking has a day', async () => {
    renderTicketTopPart({ day: '20 mars 2025' })

    expect(screen.getByText('20 mars 2025')).toBeOnTheScreen()
  })

  it('should display hour block when booking has an hour', async () => {
    renderTicketTopPart({ hour: '18h56' })

    expect(screen.getByText('18h56')).toBeOnTheScreen()
  })

  it('should display ean block when offer has ean', async () => {
    renderTicketTopPart({ ean: '847093429038' })

    expect(screen.getByText(`EAN${nonBreakingSpace}: 847093429038`)).toBeOnTheScreen()
  })

  it('should display expirationDate block when booking has expirationDate', async () => {
    renderTicketTopPart({ expirationDate: 'À récupérer avant le 14 juillet 2025' })

    expect(screen.getByText(`À récupérer avant le 14 juillet 2025`)).toBeOnTheScreen()
  })
})

const renderTicketTopPart = ({
  hour,
  day,
  isDuo,
  ean,
  expirationDate,
}: {
  hour?: string
  day?: string
  isDuo?: boolean
  ean?: string
  expirationDate?: string
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
        ean={ean}
        expirationDate={expirationDate}
      />
    )
  )
}
