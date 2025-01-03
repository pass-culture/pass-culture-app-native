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
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
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

const mockUseIsCookiesListUpToDate = jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue({
    isCookiesListUpToDate: true,
    cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
  })

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

  it('should not render the modal if no bookings without reactions', () => {
    render(<IncomingReactionModalContainer bookings={endedBookingWithReaction} />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if there is a booking without reaction after 24 hours, subcategory is in reactionCategories remote config and cookies consent not up-to-date', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: false,
      cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
    })

    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookings={endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if there is a booking without reaction after 24 hours, subcategory is in reactionCategories remote config and cookies last update not received', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: true,
      cookiesLastUpdate: undefined,
    })

    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookings={endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should render the modal if there is a booking without reaction after 24 hours, subcategory is in reactionCategories remote config and cookies consent up-to-date', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookings={endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
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
          bookings={endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
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
          bookings={endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
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
        <IncomingReactionModalContainer bookings={bookingsWith2EndedBookings} />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    fireEvent.press(screen.getByTestId('Donner mon avis'))

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('should not render the modal if there is a booking without reaction after 24 hours and subcategory is not in reactionCategories remote config', async () => {
    render(
      reactQueryProviderHOC(
        <IncomingReactionModalContainer
          bookings={endedBookingForInstrumentWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate}
        />
      )
    )

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if booking has userReaction', () => {
    render(
      <IncomingReactionModalContainer
        bookings={endedBookingWithReactionAndDateUsedMoreThan24hAfterCurrentDate}
      />
    )

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if less than 24 hours have passed', () => {
    render(
      <IncomingReactionModalContainer
        bookings={endedBookingWithoutReactionAndDateUsedLessThan24hAfterCurrentDate}
      />
    )

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })
})

const lessThan24hAfterCurrentDate = new Date(
  CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1000
).toISOString()
const moreThan24hAfterCurrentDate = new Date(
  CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000
).toISOString()

const endedBookingWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate = {
  ended_bookings: [
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
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}
const endedBookingForInstrumentWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: moreThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.ACHAT_INSTRUMENT,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithoutReactionAndDateUsedLessThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: lessThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const bookingsWith2EndedBookings = {
  ended_bookings: [
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
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReaction = {
  ended_bookings: [{ ...bookingsSnap.ended_bookings[0], userReaction: ReactionTypeEnum.LIKE }],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReactionAndDateUsedMoreThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: ReactionTypeEnum.LIKE,
      dateUsed: moreThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}
