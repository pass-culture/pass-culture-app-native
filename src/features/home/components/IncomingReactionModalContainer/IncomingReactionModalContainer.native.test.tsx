import mockdate from 'mockdate'
import React from 'react'

import { ReactionTypeEnum, SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { bookingsSnap } from 'features/bookings/fixtures'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

jest.mock('libs/firebase/analytics/analytics')

const mockMutate = jest.fn()
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('IncomingReactionModalContainer', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render the modal if there is a booking without reaction after 24 hours, subcategory is in reactionCategories remote config', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookingsEligibleToReaction={
            endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate
          }
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.getByText('Choix de réaction')).toBeOnTheScreen()
  })

  it('should send reaction from offer has subcategory in reactionCategories remote config', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookingsEligibleToReaction={
            endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate
          }
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(await screen.findByText('J’aime'))
    await user.press(screen.getByText('Valider la réaction'))

    expect(mockMutate).toHaveBeenNthCalledWith(1, {
      reactions: [
        {
          offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
          reactionType: ReactionTypeEnum.LIKE,
        },
      ],
    })
  })

  it('should send reaction with NO_REACTION when closing modal from offer has subcategory in reactionCategories remote config', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookingsEligibleToReaction={
            endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate
          }
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByTestId('Fermer la modale'))

    expect(mockMutate).toHaveBeenNthCalledWith(1, {
      reactions: [
        {
          offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
          reactionType: ReactionTypeEnum.NO_REACTION,
        },
      ],
    })
  })

  it('should not send reaction with NO_REACTION when closing modal from offers have subcategory in reactionCategories remote config and pressing "Donner mon avis" button', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer bookingsEligibleToReaction={bookingsWith2EndedBookings} />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByTestId('Donner mon avis'))

    expect(mockMutate).not.toHaveBeenCalled()
  })
})

const moreThan24hAfterCurrentDate = new Date(
  CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000
).toISOString()

const endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate = [
  {
    ...bookingsSnap.ended_bookings[0],
    userReaction: null,
    dateUsed: moreThan24hAfterCurrentDate,
    stock: {
      ...bookingsSnap.ended_bookings[0].stock,
      offer: {
        ...bookingsSnap.ended_bookings[0].stock.offer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      },
    },
  },
]

const bookingsWith2EndedBookings = [
  {
    ...bookingsSnap.ended_bookings[0],
    userReaction: null,
    dateUsed: moreThan24hAfterCurrentDate,
    stock: {
      ...bookingsSnap.ended_bookings[0].stock,
      offer: {
        ...bookingsSnap.ended_bookings[0].stock.offer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      },
    },
  },
  {
    ...bookingsSnap.ended_bookings[0],
    userReaction: null,
    dateUsed: moreThan24hAfterCurrentDate,
    stock: {
      ...bookingsSnap.ended_bookings[0].stock,
      offer: {
        ...bookingsSnap.ended_bookings[0].stock.offer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      },
    },
  },
]
