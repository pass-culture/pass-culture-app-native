import { BookingReponse, PostOneReactionRequest } from 'api/gen'

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
  eligibleBookingsForArchive?: Booking[]
  onSaveReaction?: (reactionParams: PostOneReactionRequest) => Promise<boolean>
}
