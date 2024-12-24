import mockdate from 'mockdate'
import React from 'react'

import {
  AvailableReactionBooking,
  BookingReponse,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { useBookings } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
import { useAvailableReaction } from 'features/reactions/api/useAvailableReaction'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/bookings/api')
const mockUseBookings = useBookings as jest.Mock

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.mock('features/reactions/api/useAvailableReaction')
const mockUseAvailableReaction = useAvailableReaction as jest.Mock

const mockUseIsCookiesListUpToDate = jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue({
    isCookiesListUpToDate: true,
    cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
  })

const mockBaseAvailableBooking: AvailableReactionBooking = {
  name: 'Avez-vous déjà vu\u00a0?',
  offerId: 147874,
  subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
  image: null,
  dateUsed: null,
}

const mockBaseBooking: BookingReponse = {
  ...bookingsSnap.ended_bookings[0],
  userReaction: null,
  stock: {
    ...bookingsSnap.ended_bookings[0].stock,
    offer: {
      ...bookingsSnap.ended_bookings[0].stock.offer,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    },
  },
}

const user = userEvent.setup()

jest.useFakeTimers()

describe('IncomingReactionModalContainer', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should not render the modal if no bookings without reactions', () => {
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          { ...bookingsSnap.ended_bookings[0], userReaction: ReactionTypeEnum.LIKE },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: { bookings: [], numberOfReactableBookings: 0 },
    })

    render(<IncomingReactionModalContainer />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if there is an available booking without reaction after 24 hours and cookies consent not up-to-date', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: false,
      cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
    })
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if there is an available booking without reaction after 24 hours and cookies last update not received', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: true,
      cookiesLastUpdate: undefined,
    })
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should render the modal if there is an available booking without reaction after 24 hours and cookies consent up-to-date', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.getByText('Choix de réaction')).toBeOnTheScreen()
  })

  it('should send reaction from offer in availables bookings for reaction', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

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

  it('should send reaction with NO_REACTION when closing modal from offer in availables bookings for reaction', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

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

  it('should not send reaction with NO_REACTION when closing modal from offer in availables bookings for reaction and pressing "Donner mon avis" button', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 2,
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 2,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByTestId('Donner mon avis'))

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('should not render the modal if there is a booking without reaction after 24 hours and offer not available in bookings for reaction', async () => {
    const now = new Date()
    const dateUsed = new Date(now.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [],
        numberOfReactableBookings: 0,
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if less than 24 hours have passed', () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...mockBaseBooking,
            dateUsed,
          },
        ],
      },
    })
    mockUseAvailableReaction.mockReturnValueOnce({
      data: {
        bookings: [
          {
            ...mockBaseAvailableBooking,
            dateUsed,
          },
        ],
        numberOfReactableBookings: 1,
      },
    })

    render(<IncomingReactionModalContainer />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })
})
