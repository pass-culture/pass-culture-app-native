import mockdate from 'mockdate'
import React from 'react'

import {
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.useFakeTimers()

describe('IncomingReactionModalContainer', () => {
  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      reactionCategories: {
        categories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
      },
    })
  })

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

    fireEvent.press(await screen.findByText('J’aime'))
    fireEvent.press(screen.getByText('Valider la réaction'))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
            reactionType: ReactionTypeEnum.LIKE,
          },
        ],
      })
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

    fireEvent.press(screen.getByTestId('Fermer la modale'))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenNthCalledWith(1, {
        reactions: [
          {
            offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
            reactionType: ReactionTypeEnum.NO_REACTION,
          },
        ],
      })
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

    fireEvent.press(screen.getByTestId('Donner mon avis'))

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
