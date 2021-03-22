import { BookingsResponse } from 'api/gen'

type Unpacked<T> = T extends (infer U)[] ? U : T

export type Booking = Unpacked<BookingsResponse['ongoing_bookings']>
