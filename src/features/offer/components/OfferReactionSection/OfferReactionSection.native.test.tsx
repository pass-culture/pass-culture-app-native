import React, { ComponentProps } from 'react'

import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { offerProAdvicesCardDataFixture } from 'features/advices/fixtures/offerProAdvices.fixture'
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
  beforeEach(() => {
    mockIsSuccess = true
    mockScrollToAnchor.mockClear()
    useScrollToAnchorSpy.mockReturnValue(mockScrollToAnchor)
  })

  describe('Likes information', () => {
    it('should display information when other users have reacted to the offer', async () => {
      renderOfferReactionSection({ likesCount: 1 })

      expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
    })

    it('should not display information when not exists', () => {
      renderOfferReactionSection({ clubAdvicesCount: 1 })

      expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
    })
  })

  describe('Club advices information', () => {
    it('should display information when exist', async () => {
      renderOfferReactionSection({
        clubAdvicesCount: 3,
        clubAdvices: [advicesFixture[0], advicesFixture[1], advicesFixture[2]],
      })

      expect(await screen.findByText('3 avis book club')).toBeOnTheScreen()
    })

    it('should scroll to advices section when clicking on published advices counter', async () => {
      const user = userEvent.setup()
      renderOfferReactionSection({
        clubAdvices: [advicesFixture[0], advicesFixture[1]],
        clubAdvicesCount: 2,
      })

      const advicesCounter = screen.getByTestId('clubAdvicesCounter')
      await user.press(advicesCounter)

      expect(mockScrollToAnchor).toHaveBeenCalledWith('club-advice-section')
    })
  })

  describe('Pro advices information', () => {
    it('should display information when exist', async () => {
      renderOfferReactionSection({
        proAdvicesCount: 2,
        proAdvices: [...offerProAdvicesCardDataFixture],
      })

      expect(await screen.findByText('2 avis des pros')).toBeOnTheScreen()
    })

    it('should scroll to advices section when clicking on published advices counter', async () => {
      const user = userEvent.setup()
      renderOfferReactionSection({
        proAdvices: [...offerProAdvicesCardDataFixture],
        proAdvicesCount: 2,
      })

      const advicesCounter = screen.getByTestId('proAdvicesCounter')
      await user.press(advicesCounter)

      expect(mockScrollToAnchor).toHaveBeenCalledWith('pro-advice-section')
    })

    it('should display new tag when wipProReviewsNewTag FF activated', async () => {
      renderOfferReactionSection({
        proAdvices: [...offerProAdvicesCardDataFixture],
        proAdvicesCount: 2,
        enableProReviewNewTag: true,
      })

      await screen.findByText('2 avis des pros')

      expect(screen.getByText('Nouveau')).toBeOnTheScreen()
    })

    it('should not display new tag when wipProReviewsNewTag FF deactivated', async () => {
      renderOfferReactionSection({
        proAdvices: [...offerProAdvicesCardDataFixture],
        proAdvicesCount: 2,
        enableProReviewNewTag: false,
      })

      await screen.findByText('2 avis des pros')

      expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
    })
  })

  describe('Headline offers information', () => {
    it('should display information when exist', async () => {
      renderOfferReactionSection({ headlineOffersCount: 3 })

      expect(await screen.findByText('Recommandé par 3 lieux culturels')).toBeOnTheScreen()
      expect(screen.getByTestId('headlineOffersCounterIcon')).toBeOnTheScreen()
    })

    it('should not display information when not exists', () => {
      renderOfferReactionSection({ likesCount: 3 })

      expect(screen.queryByTestId('headlineOffersCounterIcon')).not.toBeOnTheScreen()
    })
  })

  it('should display nothing when there are not advices, likes information and headline offers count', async () => {
    renderOfferReactionSection({})

    expect(screen.queryByTestId('likesCounterIcon')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('headlineOffersCounter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('clubAdvicesCounter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('proAdvicesCounter')).not.toBeOnTheScreen()
  })
})

type RenderOfferReactionSectionType = Partial<ComponentProps<typeof OfferReactionSection>>

function renderOfferReactionSection({
  clubAdvicesCount = 0,
  likesCount = 0,
  headlineOffersCount = 0,
  clubAdvices,
  adviceVariantInfo = adviceVariantInfoFixture,
  proAdvicesCount = 0,
  proAdvices,
  enableProReviewNewTag,
}: RenderOfferReactionSectionType) {
  render(
    reactQueryProviderHOC(
      <OfferReactionSection
        clubAdvicesCount={clubAdvicesCount}
        likesCount={likesCount}
        headlineOffersCount={headlineOffersCount}
        clubAdvices={clubAdvices}
        adviceVariantInfo={adviceVariantInfo}
        proAdvices={proAdvices}
        proAdvicesCount={proAdvicesCount}
        enableProReviewNewTag={enableProReviewNewTag}
      />
    )
  )
}
