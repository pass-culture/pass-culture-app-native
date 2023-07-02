import { BookingReponse } from 'api/gen'

export type BookingProperties = {
  isDuo?: boolean
  isEvent?: boolean
  isPhysical?: boolean
  isDigital?: boolean
  isPermanent?: boolean
  hasActivationCode?: boolean
}

export type Booking = BookingReponse
export type RideResponseType = {
  reservationid: number
  tripid: string
  tripamount: number
  source: {
    lat: number
    lon: number
    name: string
  }
  destination: {
    lat: number
    lon: number
    name: string
  }
  tripdate: string
  commonKey: string
}

export interface BookingItemProps {
  booking: Booking
  eligibleBookingsForArchive?: Booking[]
}
