import React, { ComponentProps } from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const mockBookingsWithoutReaction = {
  ...bookingsSnap,
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[1],
      canReact: true,
      stock: {
        ...bookingsSnap.ended_bookings[1].stock,
        offer: { ...bookingsSnap.ended_bookings[1].stock.offer, id: offerResponseSnap.id },
      },
    },
  ],
}
const mockBookingsWithLike = {
  ...bookingsSnap,
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[1],
      canReact: true,
      stock: {
        ...bookingsSnap.ended_bookings[1].stock,
        offer: { ...bookingsSnap.ended_bookings[1].stock.offer, id: offerResponseSnap.id },
      },
      userReaction: ReactionTypeEnum.LIKE,
    },
  ],
}
const mockBookingsWithDislike = {
  ...bookingsSnap,
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[1],
      canReact: true,
      stock: {
        ...bookingsSnap.ended_bookings[1].stock,
        offer: { ...bookingsSnap.ended_bookings[1].stock.offer, id: offerResponseSnap.id },
      },
      userReaction: ReactionTypeEnum.DISLIKE,
    },
  ],
}

jest.mock('queries/bookings/useBookingsQuery')
const mockUseBookings = useBookingsQuery as jest.Mock

const mockMutate = jest.fn()
let mockIsSuccess = true
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate, isSuccess: mockIsSuccess }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('<OfferReactionSection />', () => {
  describe('When FF is enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
      mockIsSuccess = true
    })

    it("should display 'J'aime' or 'Je n'aime pas' button when user booked the offer", async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      expect(await screen.findByText('J’aime')).toBeOnTheScreen()
      expect(await screen.findByText('Je n’aime pas')).toBeOnTheScreen()
    })

    it('should display reaction count when other users have reacted to the offer', async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })

      renderOfferReactionSection({})

      expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
    })

    it('should send like reaction when pressing J’aime button and user not already send a reaction', async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })

      renderOfferReactionSection({})

      await user.press(screen.getByText('J’aime'))

      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: offerResponseSnap.id,
            reactionType: ReactionTypeEnum.LIKE,
          },
        ],
      })
    })

    it('should send no reaction when pressing J’aime button and user already liked the offer', async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithLike })

      renderOfferReactionSection({})

      await user.press(screen.getByText('J’aime'))

      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: offerResponseSnap.id,
            reactionType: ReactionTypeEnum.NO_REACTION,
          },
        ],
      })
    })

    it('should send dislike reaction when pressing Je n’aime pas button and user not already send a reaction', async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })

      renderOfferReactionSection({})

      await user.press(screen.getByText('Je n’aime pas'))

      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: offerResponseSnap.id,
            reactionType: ReactionTypeEnum.DISLIKE,
          },
        ],
      })
    })

    it('should send no reaction when pressing Je n’aime pas button and user already disliked the offer', async () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithDislike })

      renderOfferReactionSection({})

      await user.press(screen.getByText('Je n’aime pas'))

      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: offerResponseSnap.id,
            reactionType: ReactionTypeEnum.NO_REACTION,
          },
        ],
      })
    })
  })

  describe('When FF is disabled', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it("should not display 'J'aime' or 'Je n'aime pas' button when user booked the offer", () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })

      renderOfferReactionSection({})

      expect(screen.queryByText('J’aime')).not.toBeOnTheScreen()
      expect(screen.queryByText('Je n’aime pas')).not.toBeOnTheScreen()
    })

    it('should not display reaction count when other users have reacted to the offer', () => {
      mockUseBookings.mockReturnValueOnce({ data: mockBookingsWithoutReaction })

      renderOfferReactionSection({})

      expect(screen.queryByText('1 j’aime')).not.toBeOnTheScreen()
    })
  })
})

type RenderOfferReactionSectionType = Partial<ComponentProps<typeof OfferReactionSection>>

function renderOfferReactionSection({ offer = offerResponseSnap }: RenderOfferReactionSectionType) {
  render(reactQueryProviderHOC(<OfferReactionSection offer={offer} />))
}
