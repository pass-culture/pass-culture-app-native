import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/Ticket/TicketDisplay'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

interface ComputeParams {
  topBlockHeight: number
  windowHeight: number
  display: 'punched' | 'full'
}
export const TICKET_FULL_SEPARATION_HEIGHT = getSpacing(10)
export const COMPENSATE_FULL = getSpacing(6)

export function computeHeaderImageHeight({ topBlockHeight, windowHeight, display }: ComputeParams) {
  const isPunched = display === 'punched'
  const extra = getSpacing(offerImageContainerMarginTop)

  const ticketSeparationOffset = isPunched
    ? TICKET_SEPARATION_HEIGHT / 2
    : TICKET_FULL_SEPARATION_HEIGHT + COMPENSATE_FULL

  const headerImageHeight = topBlockHeight + extra + ticketSeparationOffset

  const scrollContentHeight = windowHeight - blurImageHeight
  return { headerImageHeight, scrollContentHeight }
}
