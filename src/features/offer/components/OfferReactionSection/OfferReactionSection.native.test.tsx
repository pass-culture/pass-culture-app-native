import React, { ComponentProps } from 'react'

import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import * as AnchorContextModule from 'ui/components/anchor/AnchorContext'

jest.mock('queries/bookings/useBookingsQuery')
const mockMutate = jest.fn()
let mockIsSuccess = true
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate, isSuccess: mockIsSuccess }),
}))

const mockScrollToAnchor = jest.fn()
const useScrollToAnchorSpy = jest.spyOn(AnchorContextModule, 'useScrollToAnchor')

describe('<OfferReactionSection />', () => {
  describe('When FF is enabled', () => {
    beforeEach(() => {
      mockIsSuccess = true
      mockScrollToAnchor.mockClear()
      useScrollToAnchorSpy.mockReturnValue(mockScrollToAnchor)
    })

    it('should display likes information when other users have reacted to the offer', async () => {
      renderOfferReactionSection({ likesCount: 1 })

      expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
    })

    it('should not display likes information when not exists', () => {
      renderOfferReactionSection({ advicesCount: 1 })

      expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
    })

    it('should display advices information when exist', async () => {
      renderOfferReactionSection({
        advicesCount: 3,
        advices: [advicesFixture[0], advicesFixture[1], advicesFixture[2]],
      })

      expect(await screen.findByText('3 avis book club')).toBeOnTheScreen()
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

    it('should display nothing when there are not advices, likes information and headline offers count', async () => {
      renderOfferReactionSection({})

      expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('headlineOffersCounterIcon')).not.toBeOnTheScreen()
    })

    it('should display labelReaction when there are only unpublished advices', async () => {
      renderOfferReactionSection({
        advices: [],
        advicesCount: 10,
        adviceVariantInfo: {
          ...adviceVariantInfoFixture,
          labelReaction: 'Book-club',
        },
      })

      expect(await screen.findByText('Recommandé par le Book-club')).toBeOnTheScreen()
    })

    it('should not display anything when there are no advices at all', () => {
      renderOfferReactionSection({
        advicesCount: 0,
        advices: [],
        adviceVariantInfo: {
          ...adviceVariantInfoFixture,
          labelReaction: 'Book-club',
        },
      })

      expect(screen.queryByText(/Recommandé par/)).not.toBeOnTheScreen()
    })

    it('should display the number of published advices when there is at least one published offer', async () => {
      render(
        reactQueryProviderHOC(
          <OfferReactionSection
            advicesCount={4}
            advices={advicesFixture}
            adviceVariantInfo={adviceVariantInfoFixture}
          />
        )
      )

      expect(await screen.findByText('4 avis book club')).toBeOnTheScreen()
    })

    it('should display published advices count when there is at least one published advice', async () => {
      renderOfferReactionSection({
        advices: [advicesFixture[0], advicesFixture[1]],
        advicesCount: 5,
        adviceVariantInfo: {
          ...adviceVariantInfoFixture,
          labelReaction: 'book club',
        },
      })

      expect(await screen.findByText('5 avis book club')).toBeOnTheScreen()
    })

    it('should scroll to advices section when clicking on published advices counter', async () => {
      const user = userEvent.setup()
      renderOfferReactionSection({
        advices: [advicesFixture[0], advicesFixture[1]],
        advicesCount: 2,
      })

      const advicesCounter = screen.getByTestId('advicesCounter')
      await user.press(advicesCounter)

      expect(mockScrollToAnchor).toHaveBeenCalledWith('club-advice-section')
    })

    it('should not be clickable when there are only unpublished advices', async () => {
      renderOfferReactionSection({
        advices: [],
        advicesCount: 5,
        adviceVariantInfo: {
          ...adviceVariantInfoFixture,
          labelReaction: 'Book Club',
        },
      })

      expect(await screen.findByText('Recommandé par le Book Club')).toBeOnTheScreen()
      expect(screen.queryByTestId('advicesCounter')).not.toBeOnTheScreen()
    })

    it('should not render clickable element when there are no advices', () => {
      renderOfferReactionSection({
        advicesCount: 0,
        advices: [],
      })

      expect(screen.queryByTestId('advicesCounter')).not.toBeOnTheScreen()
    })
  })
})

type RenderOfferReactionSectionType = Partial<ComponentProps<typeof OfferReactionSection>>

function renderOfferReactionSection({
  advicesCount = 0,
  likesCount = 0,
  headlineOffersCount = 0,
  advices,
  adviceVariantInfo = adviceVariantInfoFixture,
}: RenderOfferReactionSectionType) {
  render(
    reactQueryProviderHOC(
      <OfferReactionSection
        advicesCount={advicesCount}
        likesCount={likesCount}
        headlineOffersCount={headlineOffersCount}
        advices={advices}
        adviceVariantInfo={adviceVariantInfo}
      />
    )
  )
}
