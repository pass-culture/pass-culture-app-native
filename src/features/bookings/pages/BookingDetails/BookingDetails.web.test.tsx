import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import {
  BookingReponse,
  BookingResponse,
  SubcategoriesResponseModelv2,
  TicketDisplayEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { bookingsSnap, bookingsSnapV2 } from 'features/bookings/fixtures'
import * as ongoingOrEndedBookingAPI from 'features/bookings/queries/useOngoingOrEndedBookingQuery'
import { Booking } from 'features/bookings/types'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)
jest.mock('features/auth/context/AuthContext')

jest.mock('queries/profile/useResetRecreditAmountToShowMutation')
jest.mock('libs/itinerary/useItinerary')
jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('libs/network/NetInfoWrapper')
const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('libs/firebase/analytics/analytics')

describe('BookingDetails', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  useRoute.mockImplementation(() => ({ params: { id: 456 } }))

  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('BookingDetails', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderBookingDetails(bookingsSnap.ongoing_bookings[0])

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    describe('when FF WIP_NEW_BOOKING_PAGE is on', () => {
      let ongoingBookingV2: BookingResponse = bookingsSnapV2.ongoingBookings[0]

      beforeEach(() => {
        ongoingBookingV2 = bookingsSnapV2.ongoingBookings[0]

        mockServer.getApi<SubcategoriesResponseModelv2>(
          '/v1/subcategories/v2',
          subcategoriesDataTest
        )
        mockUseNetInfoContext.mockReturnValue({ isConnected: true })
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKING_PAGE])
      })

      it('should not have basic accessibility issues', async () => {
        const { container } = renderBookingDetailsV2({ booking: ongoingBookingV2 })

        await act(async () => {
          const results = await checkAccessibilityFor(container)

          expect(results).toHaveNoViolations()
        })
      })

      it.each`
        isDesktopViewport
        ${true}
        ${false}
      `(
        'should not render error message when booking is no ticket and isDesktopViewport is $isDesktopViewport',
        async ({ isDesktopViewport }) => {
          renderBookingDetailsV2({
            booking: {
              ...ongoingBookingV2,
              ticket: {
                voucher: null,
                token: null,
                withdrawal: {
                  details: null,
                  type: WithdrawalTypeEnum.no_ticket,
                  delay: null,
                },
                activationCode: null,
                externalBooking: null,
                display: TicketDisplayEnum.no_ticket,
              },
            },
            isDesktopViewport,
          })
          await screen.findByTestId('withdrawal-info-no-ticket')

          await waitFor(() => {
            expect(
              screen.queryByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
            ).not.toBeOnTheScreen()
          })
        }
      )

      it.each`
        isDesktopViewport
        ${true}
        ${false}
      `(
        'should render error message when booking is ticket and isDesktopViewport is $isDesktopViewport',
        async ({ isDesktopViewport }) => {
          renderBookingDetailsV2({ booking: ongoingBookingV2, isDesktopViewport })

          expect(
            screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
          ).toBeTruthy()
        }
      )
    })
  })
})

const renderBookingDetails = (booking: Booking) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingReponse | null>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}

const renderBookingDetailsV2 = ({
  booking,
  isDesktopViewport,
}: {
  booking?: BookingResponse
  isDesktopViewport?: boolean
}) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQuery').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingResponse | null, Error>)

  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingReponse | null, Error>)
  return render(reactQueryProviderHOC(<BookingDetails />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
}
