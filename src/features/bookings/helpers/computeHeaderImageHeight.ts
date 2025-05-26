import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/TicketCutout/TicketCutoutContent'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

interface ComputeParams {
  topBlockHeight: number
  windowHeight: number
}

export function computeHeaderImageHeight({ topBlockHeight, windowHeight }: ComputeParams) {
  const extra = getSpacing(offerImageContainerMarginTop)

  const ticketSeparationOffset = TICKET_SEPARATION_HEIGHT / 2

  const headerImageHeight = topBlockHeight + extra + ticketSeparationOffset
  const scrollContentHeight = windowHeight - blurImageHeight

  return { headerImageHeight, scrollContentHeight }
}
