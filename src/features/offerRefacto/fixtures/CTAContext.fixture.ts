import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { CTAContext } from 'features/offerRefacto/types'

export const CTAContextFixture = {
  offer: offerResponseSnap,
  bookOffer: jest.fn(),
  isUnderageBeneficiary: false,
  isBookingLoading: false,
  booking: {
    completedUrl: 'https://www.google.com/',
    canReact: false,
    dateCreated: '03/03/2026',
    enablePopUpReaction: false,
    id: 1,
    quantity: 1,
    totalAmount: 10,
    stock: {
      features: [],
      id: offerResponseSnap.stocks[0].id,
      offer: { ...offerResponseSnap, isPermanent: true },
      price: 10,
    },
  },
} satisfies CTAContext
