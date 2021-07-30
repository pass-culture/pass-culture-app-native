import { Dimensions } from 'react-native'

import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { ticketFooterRatio } from 'ui/svg/TicketFooter'
import { getSpacing } from 'ui/theme'

const { width, height } = Dimensions.get('window')

// The ticket is the shape:
//     _____      ____      _
//    |     \____/    |      |  1. TicketHeader
//    |_______________|      |
//    |               |      |
//    |               |      |  2. TicketContent
//    |               |      | => TICKET_HEIGHT
//    |               |      |
//    |_______________|      |
//    |      _____    |      |  3. TicketFooter
//    |_____/     \___|     _|
//
//    <-------------->
//      TICKET_WIDTH

const TICKET_MAX_WIDTH = 300
// The ticket width is fixed based on the device's width
export const TICKET_WIDTH = Math.min(TICKET_MAX_WIDTH, width - getSpacing(15))

export const TICKET_FOOTER_HEIGHT = TICKET_WIDTH / ticketFooterRatio

export const TICKET_MIN_HEIGHT = 250

export const QR_CODE_SIZE = 170

export const contentHeight = height - blurImageHeight
