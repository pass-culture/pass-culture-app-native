import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/TicketCutout/TicketCutoutContent'
import { computeHeaderImageHeight } from 'features/bookings/helpers/computeHeaderImageHeight'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

describe('computeHeaderImageHeight', () => {
  const params = {
    topBlockHeight: 120,
    windowHeight: 780,
  }

  const ticketSeparationOffset = TICKET_SEPARATION_HEIGHT / 2
  const extra = getSpacing(offerImageContainerMarginTop)
  const expectedScrollHeight = params.windowHeight - blurImageHeight

  it('should compute right height for web', () => {
    const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight(params)

    expect(headerImageHeight).toEqual(params.topBlockHeight + extra + ticketSeparationOffset)
    expect(scrollContentHeight).toEqual(expectedScrollHeight)
  })
})
