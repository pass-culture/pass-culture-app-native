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
  ticket_punched_middle_height: number
}

export function computeHeaderImageHeight({
  topBlockHeight,
  windowHeight,
  display,
  isAndroid,
  ticketFullMiddleHeight,
  extraAndroidMargin,
  ticket_punched_middle_height,
}: ComputeParams) {
  const isPunched = display === 'punched'
  const halfOfMiddleBlockHeight =
    (isPunched ? ticket_punched_middle_height : ticketFullMiddleHeight + EXTRA_FULL) / 2

  const headerImageHeight =
    topBlockHeight +
    halfOfMiddleBlockHeight +
    MARGIN_TOP_TICKET +
    (isAndroid ? extraAndroidMargin : 0)

  const scrollContentHeight = windowHeight - blurImageHeight
  return { headerImageHeight, scrollContentHeight }
}
