import React, { ComponentProps } from 'react'

import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('queries/bookings/useBookingsQuery')
const mockMutate = jest.fn()
let mockIsSuccess = true
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate, isSuccess: mockIsSuccess }),
}))

describe('<OfferReactionSection />', () => {
  describe('When FF is enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
      mockIsSuccess = true
    })

    it('should display likes information when other users have reacted to the offer', async () => {
      renderOfferReactionSection({ likesCount: 1 })

      expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
    })

    it('should not display likes information when not exists', () => {
      renderOfferReactionSection({ chroniclesCount: 1 })

      expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
    })

    it('should display chronicles information when exist', async () => {
      renderOfferReactionSection({ chroniclesCount: 3 })

      expect(await screen.findByText('3 avis')).toBeOnTheScreen()
      expect(screen.getByTestId('chroniclesCounterIcon')).toBeOnTheScreen()
    })

    it('should not display chronicles information when not exists', () => {
      renderOfferReactionSection({ likesCount: 2 })

      expect(screen.queryByTestId('chroniclesCounterIcon')).not.toBeOnTheScreen()
    })

    it('should display headline offers count when exist', async () => {
      renderOfferReactionSection({ headlineOffersCount: 3 })

      expect(await screen.findByText('Recommandé par 3 lieux culturels')).toBeOnTheScreen()
      expect(screen.getByTestId('headlineOffersCounterIcon')).toBeOnTheScreen()
    })

    it('should not display headline offers count when not exists', () => {
      renderOfferReactionSection({ likesCount: 3 })

      expect(screen.queryByTestId('headlineOffersCounterIcon')).not.toBeOnTheScreen()
    })

    it('should display nothing when there are not chronicles, likes information and headline offers count', async () => {
      renderOfferReactionSection({})

      expect(screen.queryByTestId('chroniclesCounterIcon')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('headlineOffersCounterIcon')).not.toBeOnTheScreen()
    })
  })
})

type RenderOfferReactionSectionType = Partial<ComponentProps<typeof OfferReactionSection>>

function renderOfferReactionSection({
  chroniclesCount = 0,
  likesCount = 0,
  headlineOffersCount = 0,
}: RenderOfferReactionSectionType) {
  render(
    reactQueryProviderHOC(
      <OfferReactionSection
        chroniclesCount={chroniclesCount}
        likesCount={likesCount}
        headlineOffersCount={headlineOffersCount}
      />
    )
  )
}
