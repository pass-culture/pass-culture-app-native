import {
  BookingActivationCodeResponse,
  BookingCancellationReasons,
  BookingStockResponse,
  SubcategoryIdEnum,
} from 'api/gen'

export type TicketDouble = {
  seat: string | null
  barcode: string
}

export interface TicketDoubleWithCurrentSeatIndex extends TicketDouble {
  seatIndex?: string
}

export interface BookingReponseBis {
  activationCode?: BookingActivationCodeResponse | null
  cancellationDate?: string | null
  cancellationReason?: BookingCancellationReasons | null
  completedUrl?: string | null
  confirmationDate?: string | null
  dateUsed?: string | null
  expirationDate?: string | null
  id: number
  quantity: number
  qrCodeData?: string | null
  stock: BookingStockResponse
  token: string
  totalAmount: number
  externalBookingsInfos?: TicketDouble[]
}

export interface BookingWithExternalBookingInformationsReponse {
  ended_bookings: Array<BookingReponseBis>
  ongoing_bookings: Array<BookingReponseBis>
}

// TODO(LucasBeneston): remove this file when use a real offer with 2 tickets for PO review
export const bookingsWithExternalBookingInformationsSnap: BookingWithExternalBookingInformationsReponse =
  {
    ended_bookings: [
      {
        id: 321,
        cancellationDate: '2021-03-15T23:01:37.925926',
        cancellationReason: BookingCancellationReasons.BENEFICIARY,
        confirmationDate: '2021-02-15T23:01:37.925926',
        dateUsed: null,
        expirationDate: null,
        totalAmount: 1900,
        token: '352UW5',
        quantity: 10,
        stock: {
          id: 150230,
          beginningDatetime: '2021-03-14T20:00:00',
          offer: {
            id: 147874,
            name: 'Avez-vous déjà vu ?',
            extraData: null,
            isPermanent: false,
            isDigital: true,
            subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
            venue: {
              id: 2185,
              city: 'Drancy',
              name: 'Maison de la Brique',
              coordinates: {
                latitude: 48.91683,
                longitude: 2.43884,
              },
            },
            withdrawalDetails: null,
          },
        },
      },
    ],
    ongoing_bookings: [
      {
        id: 123,
        cancellationDate: null,
        cancellationReason: null,
        confirmationDate: '2021-03-15T23:01:37.925926',
        dateUsed: null,
        expirationDate: null,
        totalAmount: 1900,
        token: '352UW4',
        quantity: 10,
        qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
        stock: {
          id: 150230,
          beginningDatetime: '2021-03-15T20:00:00',
          offer: {
            id: 147874,
            name: 'Avez-vous déjà vu ?',
            extraData: {
              isbn: '123456789',
            },
            isPermanent: false,
            isDigital: false,
            subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
            venue: {
              id: 2185,
              city: 'Drancy',
              name: 'Maison de la Brique',
              coordinates: {
                latitude: 48.91683,
                longitude: 2.43884,
              },
            },
            withdrawalDetails: null,
          },
        },
        externalBookingsInfos: [
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: null },
          { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
        ],
      },
    ],
  }
