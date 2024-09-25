import { SubcategoryIdEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { ReactionChoiceModalBodyEnum } from 'features/reactions/enum'
import { getReactionChoiceModalBodyType } from 'features/reactions/helpers/getReactionChoiceModalBodyType'

describe('getReactionChoiceModalBodyType', () => {
  const bookingWithImage = {
    dateCreated: '',
    id: 1,
    quantity: 1,
    totalAmount: 20,
    stock: {
      id: 1,
      features: [],
      price: 20,
      offer: {
        id: 1,
        isDigital: false,
        isPermanent: false,
        name: 'Offre 1',
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        image: { url: 'https://example.com/image.jpg' },
        venue: bookingsSnap.ended_bookings[0].stock.offer.venue,
      },
    },
  }

  const bookingWithoutImage = {
    dateCreated: '',
    id: 2,
    quantity: 1,
    totalAmount: 10,
    stock: {
      id: 2,
      features: [],
      price: 10,
      offer: {
        id: 2,
        isDigital: false,
        isPermanent: false,
        name: 'Offre 2',
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
        venue: bookingsSnap.ended_bookings[0].stock.offer.venue,
        image: null,
      },
    },
  }

  it('should return VALIDATION when there is only one booking', () => {
    const bookings = [bookingWithoutImage]
    const result = getReactionChoiceModalBodyType(bookings)

    expect(result).toBe(ReactionChoiceModalBodyEnum.VALIDATION)
  })

  it('should return BOOKINGS_WITHOUT_IMAGE when there are multiple bookings and none have images', () => {
    const bookings = [bookingWithoutImage, bookingWithoutImage, bookingWithoutImage]
    const result = getReactionChoiceModalBodyType(bookings)

    expect(result).toBe(ReactionChoiceModalBodyEnum.BOOKINGS_WITHOUT_IMAGE)
  })

  it('should return BOOKINGS_WITH_IMAGE when there are multiple bookings with images', () => {
    const bookings = [bookingWithImage, bookingWithImage, bookingWithoutImage, bookingWithoutImage]
    const result = getReactionChoiceModalBodyType(bookings)

    expect(result).toBe(ReactionChoiceModalBodyEnum.BOOKINGS_WITH_IMAGE)
  })

  it('should return BOOKINGS_WITH_IMAGE when there are exactly 2 bookings with images', () => {
    const bookings = [bookingWithImage, bookingWithImage, bookingWithoutImage]
    const result = getReactionChoiceModalBodyType(bookings)

    expect(result).toBe(ReactionChoiceModalBodyEnum.BOOKINGS_WITH_IMAGE)
  })
})
