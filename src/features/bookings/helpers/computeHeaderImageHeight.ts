import {
  TICKET_FULL_MIDDLE_HEIGHT,
  TICKET_PUNCHED_MIDDLE_HEIGHT,
} from 'features/bookings/components/Ticket/TicketDisplay'
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

export function computeHeaderImageHeight({ topBlockHeight, windowHeight, display }: ComputeParams) {
  const isPunched = display === 'punched'
  const extra = getSpacing(offerImageContainerMarginTop)
  const halfOfMiddleBlockHeight =
    0.5 * (isPunched ? TICKET_PUNCHED_MIDDLE_HEIGHT : TICKET_FULL_MIDDLE_HEIGHT)

  const headerImageHeight = topBlockHeight + halfOfMiddleBlockHeight + extra

  const scrollContentHeight = windowHeight - blurImageHeight
  return { headerImageHeight, scrollContentHeight }
}
