import { TicketDisplayEnum, WithdrawalTypeEnum } from 'api/gen'
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
      isAutomaticallyUsed: false,
      offer: {
        id: offerResponseSnap.id,
        isDigital: offerResponseSnap.isDigital,
        isPermanent: true,
        name: offerResponseSnap.name,
        subcategoryId: offerResponseSnap.subcategoryId,
        venue: { ...offerResponseSnap.venue, address: {} },
      },
      price: 10,
    },
    ticket: {
      display: TicketDisplayEnum.ticket,
      withdrawal: {
        type: WithdrawalTypeEnum.on_site,
      },
    },
  },
} satisfies CTAContext
