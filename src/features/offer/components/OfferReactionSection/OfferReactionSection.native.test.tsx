import React, { ComponentProps } from 'react'

import { NativeCategoryIdEnumv2, ReactionTypeEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const mockBookingsWithoutReaction = {
  ...bookingsSnap,
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[1],
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
      stock: {
        ...bookingsSnap.ended_bookings[1].stock,
        offer: { ...bookingsSnap.ended_bookings[1].stock.offer, id: offerResponseSnap.id },
      },
      userReaction: ReactionTypeEnum.LIKE,
    },
  ],
}

jest.mock('features/bookings/api')
const mockUseBookings = useBookings as jest.Mock

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('features/auth/context/AuthContext')

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

describe('<OfferReactionSection />', () => {
  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      reactionCategories: {
        categories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
      },
    })
  })

  describe('When FF is enabled', () => {
    beforeEach(() => {
      activateFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it("should display 'J'aime' or 'Je n'aime pas' button when user booked the offer", async () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      expect(await screen.findByText('J’aime')).toBeOnTheScreen()
      expect(await screen.findByText('Je n’aime pas')).toBeOnTheScreen()
    })

    it('should display reaction count when other users have reacted to the offer', async () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      expect(await screen.findByText('Aimé par 1 jeune')).toBeOnTheScreen()
    })

    it('should send like reaction when pressing J’aime button and user not already send a reaction', async () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      fireEvent.press(await screen.findByText('J’aime'))

      await waitFor(() => {
        expect(mockMutate).toHaveBeenNthCalledWith(1, {
          reactions: [
            {
              offerId: offerResponseSnap.id,
              reactionType: ReactionTypeEnum.LIKE,
            },
          ],
        })
      })
    })

    it('should send no reaction when pressing J’aime button and user already liked the offer', async () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithLike })
        .mockReturnValueOnce({ data: mockBookingsWithLike })
      renderOfferReactionSection({})

      fireEvent.press(await screen.findByText('J’aime'))

      await waitFor(() => {
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
  })

  describe('When FF is disabled', () => {
    beforeEach(() => {
      activateFeatureFlags()
    })

    it("should not display 'J'aime' or 'Je n'aime pas' button when user booked the offer", () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      expect(screen.queryByText('J’aime')).not.toBeOnTheScreen()
      expect(screen.queryByText('Je n’aime pas')).not.toBeOnTheScreen()
    })

    it('should not display reaction count when other users have reacted to the offer', () => {
      mockUseBookings
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
        .mockReturnValueOnce({ data: mockBookingsWithoutReaction })
      renderOfferReactionSection({})

      expect(screen.queryByText('Aimé par 1 jeune')).not.toBeOnTheScreen()
    })
  })
})

type RenderOfferReactionSectionType = Partial<ComponentProps<typeof OfferReactionSection>>

function renderOfferReactionSection({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
}: RenderOfferReactionSectionType) {
  render(reactQueryProviderHOC(<OfferReactionSection offer={offer} subcategory={subcategory} />))
}
