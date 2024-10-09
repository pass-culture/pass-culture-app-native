import React, { ComponentProps } from 'react'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const mockBookings = {
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
const mockUseBookings = jest.fn(() => ({
  data: mockBookings,
}))
jest.mock('features/bookings/api/useBookings', () => ({
  useBookings: jest.fn(() => mockUseBookings()),
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('features/auth/context/AuthContext')

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
      renderOfferReactionSection({})

      expect(await screen.findByText('J’aime')).toBeOnTheScreen()
      expect(await screen.findByText('Je n’aime pas')).toBeOnTheScreen()
    })

    it('should display reaction count when other users have reacted to the offer', async () => {
      renderOfferReactionSection({})

      expect(await screen.findByText('Aimé par 1 jeune')).toBeOnTheScreen()
    })
  })

  describe('When FF is disabled', () => {
    beforeEach(() => {
      activateFeatureFlags()
    })

    it("should not display 'J'aime' or 'Je n'aime pas' button when user booked the offer", () => {
      renderOfferReactionSection({})

      expect(screen.queryByText('J’aime')).not.toBeOnTheScreen()
      expect(screen.queryByText('Je n’aime pas')).not.toBeOnTheScreen()
    })

    it('should not display reaction count when other users have reacted to the offer', () => {
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
