import { useOngoingBooking } from '../queries'

jest.mock('react-query')

describe('[API] booking queries', () => {
  describe('[Method] useOngoingOrEndedBooking', () => {
    it('should return ongoing_bookings where there is one', async () => {
      const bookingId = 123
      const bookingResult = useOngoingBooking(bookingId)
      expect(bookingResult).toMatchInlineSnapshot(`
        Object {
          "id": 123,
          "quantity": 3,
          "stock": Object {
            "id": 431,
            "offer": Object {
              "category": Object {
                "categoryType": "Event",
                "label": "categoryLabel",
              },
              "id": 32871,
              "isDigital": true,
              "isPermanent": true,
              "name": "mockedBookingName",
              "venue": Object {
                "coordinates": Object {},
                "id": 3131,
                "name": "venueName",
              },
            },
          },
          "token": "bookingToken",
          "totalAmount": 4,
        }
      `)
    })
    it('should not return ended_bookings where there is one', async () => {
      const bookingId = 321
      const bookingResult = useOngoingBooking(bookingId)
      expect(bookingResult).toMatchInlineSnapshot(`undefined`)
    })
  })
})
