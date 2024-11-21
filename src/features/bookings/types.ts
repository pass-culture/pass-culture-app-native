import { BookingReponse } from 'api/gen'
import { ShareContent } from 'libs/share/types'

export type BookingProperties = {
  isDuo?: boolean
  isEvent?: boolean
  isPhysical?: boolean
  isDigital?: boolean
  isPermanent?: boolean
  hasActivationCode?: boolean
}

export type Booking = BookingReponse

export interface BookingItemProps {
  booking: Booking
  handleShowReactionModal: (booking: Booking) => void
  handleShowShareOfferModal: (shareContent: ShareContent | null) => void
  eligibleBookingsForArchive?: Booking[]
}
