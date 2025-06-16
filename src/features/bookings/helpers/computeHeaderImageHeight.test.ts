import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/Ticket/TicketDisplay'
import {
  COMPENSATE_FULL,
  TICKET_FULL_SEPARATION_HEIGHT,
  computeHeaderImageHeight,
} from 'features/bookings/helpers/computeHeaderImageHeight'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

describe('computeHeaderImageHeight', () => {
  const params = {
    topBlockHeight: 120,
    windowHeight: 780,
    display: 'punched' as const,
  }

  const extra = getSpacing(offerImageContainerMarginTop)
  const expectedScrollHeight = params.windowHeight - blurImageHeight

  it('should compute right height for punched Ticket on web', () => {
    const ticketSeparationOffset = TICKET_SEPARATION_HEIGHT / 4
    const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight(params)

    expect(headerImageHeight).toEqual(params.topBlockHeight + extra + ticketSeparationOffset)
    expect(scrollContentHeight).toEqual(expectedScrollHeight)
  })

  it('should compute right height for full Ticket on web', () => {
    const ticketSeparationOffset = TICKET_FULL_SEPARATION_HEIGHT + COMPENSATE_FULL
    const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight({
      ...params,
      display: 'full' as const,
    })

    expect(headerImageHeight).toEqual(params.topBlockHeight + extra + ticketSeparationOffset)
    expect(scrollContentHeight).toEqual(expectedScrollHeight)
  })
})
