import {
  TICKET_FULL_MIDDLE_HEIGHT,
  TICKET_PUNCHED_MIDDLE_HEIGHT,
} from 'features/bookings/components/Ticket/TicketDisplay'
import { blurImageHeight } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { MARGIN_DP, getSpacing } from 'ui/theme'

export const MARGIN_TOP_TICKET = getSpacing(MARGIN_DP)
export const EXTRA_ANDROID_MARGIN = getSpacing(8)

interface ComputeParams {
  topBlockHeight: number
  windowHeight: number
  display: 'punched' | 'full'
  isAndroid?: boolean
}

export function computeHeaderImageHeight({
  topBlockHeight,
  windowHeight,
  display,
  isAndroid,
}: ComputeParams) {
  const isPunched = display === 'punched'
  const halfOfMiddleBlockHeight =
    (isPunched ? TICKET_PUNCHED_MIDDLE_HEIGHT : TICKET_FULL_MIDDLE_HEIGHT) / 2

  const headerImageHeight =
    topBlockHeight +
    halfOfMiddleBlockHeight +
    MARGIN_TOP_TICKET +
    (isAndroid ? EXTRA_ANDROID_MARGIN : 0)

  const scrollContentHeight = windowHeight - blurImageHeight
  return { headerImageHeight, scrollContentHeight }
}
