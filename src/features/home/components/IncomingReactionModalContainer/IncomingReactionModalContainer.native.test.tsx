import mockdate from 'mockdate'
import React from 'react'

import {
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { useBookings } from 'features/bookings/api'
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

jest.mock('features/bookings/api')
const mockUseBookings = useBookings as jest.Mock

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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

  it('should not render the modal if no bookings without reactions', () => {
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          { ...bookingsSnap.ended_bookings[0], userReaction: ReactionTypeEnum.LIKE },
        ],
      },
    })

    render(<IncomingReactionModalContainer />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should render the modal if there is a booking without reaction after 24 hours and subcategory is in reactionCategories remote config', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...bookingsSnap.ended_bookings[0],
            userReaction: null,
            dateUsed,
            stock: {
              ...bookingsSnap.ended_bookings[0].stock,
              offer: {
                ...bookingsSnap.ended_bookings[0].stock.offer,
                subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
              },
            },
          },
        ],
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.getByText('Choix de réaction')).toBeOnTheScreen()
  })

  it('should send reaction from offer has subcategory in reactionCategories remote config', async () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...bookingsSnap.ended_bookings[0],
            userReaction: null,
            dateUsed,
            stock: {
              ...bookingsSnap.ended_bookings[0].stock,
              offer: {
                ...bookingsSnap.ended_bookings[0].stock.offer,
                subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
              },
            },
          },
        ],
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    fireEvent.press(await screen.findByText('J’aime'))
    fireEvent.press(screen.getByText('Valider la réaction'))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })
  })

  it('should not render the modal if there is a booking without reaction after 24 hours and subcategory is not in reactionCategories remote config', async () => {
    const now = new Date()
    const dateUsed = new Date(now.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...bookingsSnap.ended_bookings[0],
            userReaction: null,
            dateUsed,
          },
        ],
      },
    })

    render(reactQueryProviderHOC(<IncomingReactionModalContainer />))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if booking has userReaction', () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString()

    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...bookingsSnap.ended_bookings[0],
            userReaction: ReactionTypeEnum.LIKE,
            dateUsed,
            stock: {
              ...bookingsSnap.ended_bookings[0].stock,
              offer: {
                ...bookingsSnap.ended_bookings[0].stock.offer,
                subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
              },
            },
          },
        ],
      },
    })

    render(<IncomingReactionModalContainer />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })

  it('should not render the modal if less than 24 hours have passed', () => {
    const dateUsed = new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1000).toISOString()
    mockUseBookings.mockReturnValueOnce({
      data: {
        ended_bookings: [
          {
            ...bookingsSnap.ended_bookings[0],
            userReaction: null,
            dateUsed,
            stock: {
              ...bookingsSnap.ended_bookings[0].stock,
              offer: {
                ...bookingsSnap.ended_bookings[0].stock.offer,
                subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
              },
            },
          },
        ],
      },
    })
    render(<IncomingReactionModalContainer />)

    expect(screen.queryByText('Choix de réaction')).not.toBeOnTheScreen()
  })
})
