import mockdate from 'mockdate'

import {
  BookingsResponseV2,
  SubcategoryIdEnum,
  TicketDisplayEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { convertOffererDatesToTimezone } from 'features/bookings/queries/selectors/convertOffererDatesToTimezone'

const defaultOffer = {
  id: 147874,
  bookingContact: null,
  name: 'Avez-vous déjà vu\u00a0?',
  address: {
    id: 115,
    street: '1 boulevard de la brique',
    postalCode: '93700',
    city: 'Drancy',
    coordinates: {
      latitude: 48.91683,
      longitude: 2.43884,
    },
    timezone: 'America/Martinique',
  },
  extraData: {
    ean: '123456789',
  },
  isPermanent: false,
  isDigital: false,
  subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
  venue: {
    address: {
      id: 116,
    },
    id: 2185,
    name: 'Maison de la Brique',
    timezone: 'Europe/Paris',
    isOpenToPublic: true,
  },
}

const offerWithoutAddress = {
  ...defaultOffer,
  address: null,
}

const defaultBooking = {
  id: 123,
  cancellationDate: null,
  cancellationReason: null,
  confirmationDate: '2021-03-15T23:01:37.925926',
  dateCreated: '2021-02-15T23:01:37.925926',
  dateUsed: null,
  expirationDate: null,
  totalAmount: 1900,
  quantity: 10,
  canReact: false,
  enablePopUpReaction: false,
  stock: {
    id: 150230,
    beginningDatetime: '2024-05-08T12:50:00Z',
    price: 400,
    priceCategoryLabel: 'Cat 4',
    features: ['VOSTFR', '3D', 'IMAX'],
    offer: defaultOffer,
  },
  ticket: {
    voucher: {
      data: 'PASSCULTURE:v3;TOKEN:352UW4',
    },
    token: {
      data: '352UW4',
    },
    withdrawal: {
      details: null,
      type: WithdrawalTypeEnum.in_app,
      delay: null,
    },
    activationCode: null,
    externalBooking: null,
    display: TicketDisplayEnum.qr_code,
  },
}

const defaultBookingsResponse: BookingsResponseV2 = {
  ongoingBookings: [defaultBooking],
  endedBookings: [defaultBooking],
  hasBookingsAfter18: false,
}

describe('convertOffererDatesToTimezone', () => {
  beforeEach(() => mockdate.set(CURRENT_DATE))

  it('should return the converted offerer dates in local timezone of offer address when present', () => {
    const result = convertOffererDatesToTimezone(defaultBookingsResponse)

    expect(result).toBeDefined()
    expect(result?.ongoingBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
    expect(result?.endedBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })

  it('should return the converted offerer dates in local timezone of venue address when offerer address is null', () => {
    const bookingsResponseV2WithoutAddress: BookingsResponseV2 = {
      ongoingBookings: [
        { ...defaultBooking, stock: { ...defaultBooking.stock, offer: offerWithoutAddress } },
      ],
      endedBookings: [defaultBooking],
      hasBookingsAfter18: false,
    }
    const result = convertOffererDatesToTimezone(bookingsResponseV2WithoutAddress)

    expect(result).toBeDefined()
    expect(result?.ongoingBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T14:50:00.000Z')
    expect(result?.endedBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })
})
