import { TICKET_PUNCHED_MIDDLE_HEIGHT } from 'features/bookings/components/Ticket/TicketDisplay'
import { blurImageHeight } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { MARGIN_DP, getSpacing } from 'ui/theme'

export const MARGIN_TOP_TICKET = getSpacing(MARGIN_DP)
const EXTRA_FULL = getSpacing(24)

interface ComputeParams {
  topBlockHeight: number
  windowHeight: number
  display: 'punched' | 'full'
  isAndroid?: boolean
  ticketFullMiddleHeight: number
  extraAndroidMargin: number
}

export function computeHeaderImageHeight({
  topBlockHeight,
  windowHeight,
  display,
  isAndroid,
  ticketFullMiddleHeight,
  extraAndroidMargin,
}: ComputeParams) {
  const isPunched = display === 'punched'
  const halfOfMiddleBlockHeight =
    (isPunched ? TICKET_PUNCHED_MIDDLE_HEIGHT : ticketFullMiddleHeight + EXTRA_FULL) / 2

  const headerImageHeight =
    topBlockHeight +
    halfOfMiddleBlockHeight +
    MARGIN_TOP_TICKET +
    (isAndroid ? extraAndroidMargin : 0)

  const scrollContentHeight = windowHeight - blurImageHeight
  return { headerImageHeight, scrollContentHeight }
}
