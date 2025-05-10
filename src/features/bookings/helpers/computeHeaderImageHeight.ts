import { Platform } from 'react-native'

import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/TicketCutout/TicketCutout'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

interface ComputeParams {
  topBlockHeight: number
  appBarHeight: number
  safeAreaTop: number
  windowHeight: number
}

export function computeHeaderImageHeight({
  topBlockHeight,
  appBarHeight,
  safeAreaTop,
  windowHeight,
}: ComputeParams) {
  const isWeb = Platform.OS === 'web'

  const extra = isWeb ? getSpacing(offerImageContainerMarginTop) : appBarHeight + safeAreaTop

  const ticketSeparationOffset = TICKET_SEPARATION_HEIGHT / 2

  const headerImageHeight = topBlockHeight + extra + ticketSeparationOffset
  const scrollContentHeight = windowHeight - blurImageHeight

  return { headerImageHeight, scrollContentHeight }
}
