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
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as useBookingByIdQueryAPI from 'queries/bookings/useBookingByIdQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)
jest.mock('features/auth/context/AuthContext')

jest.mock('queries/profile/useResetRecreditAmountToShowMutation')
jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('libs/network/NetInfoWrapper')
const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('libs/firebase/analytics/analytics')
jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

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

    describe('when FF WIP_NEW_BOOKINGS_ENDED_ONGOING is on', () => {
      let ongoingBookingV2: BookingResponse = bookingsSnapV2.ongoingBookings[0]

      beforeEach(() => {
        ongoingBookingV2 = bookingsSnapV2.ongoingBookings[0]

        mockServer.getApi<SubcategoriesResponseModelv2>(
          '/v1/subcategories/v2',
          subcategoriesDataTest
        )
        mockUseNetInfoContext.mockReturnValue({ isConnected: true })
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING])
      })

      it('should not have basic accessibility issues', async () => {
        const { container } = renderBookingDetailsWithBookingById({ booking: ongoingBookingV2 })

        await act(async () => {
          const results = await checkAccessibilityFor(container)

          expect(results).toHaveNoViolations()
        })
      })

      it('should display organizer contact when there is a organizer contact', async () => {
        renderBookingDetailsWithBookingById({
          booking: {
            ...ongoingBookingV2,
            stock: {
              ...ongoingBookingV2.stock,
              offer: { ...ongoingBookingV2.stock.offer, bookingContact: 'toto@monemail.com' },
            },
            ticket: {
              ...ongoingBookingV2.ticket,
              display: TicketDisplayEnum.no_ticket,
              withdrawal: {
                type: WithdrawalTypeEnum.no_ticket,
              },
            },
          },

          isDesktopViewport: true,
        })

        expect(screen.getByText('toto@monemail.com')).toBeInTheDocument()
      })

      it('should display details section when there is a withdrawal detail', async () => {
        renderBookingDetailsWithBookingById({
          booking: {
            ...ongoingBookingV2,
            ticket: {
              ...ongoingBookingV2.ticket,
              withdrawal: {
                details: 'Il faudra se présenter 42 minutes avant la représentation au gichet.',
              },
            },
          },
          isDesktopViewport: true,
        })

        expect(
          screen.getByText('Il faudra se présenter 42 minutes avant la représentation au gichet.')
        ).toBeInTheDocument()
      })

      it.each`
        isDesktopViewport | expectedComponent
        ${true}           | ${'booking_details_desktop'}
        ${false}          | ${'booking_details_mobile'}
      `(
        'should display $expectedComponent when isDesktopViewport is $isDesktopViewport',
        async ({ isDesktopViewport, expectedComponent }) => {
          renderBookingDetailsWithBookingById({
            booking: ongoingBookingV2,
            isDesktopViewport,
          })

          expect(screen.getByTestId(expectedComponent)).toBeInTheDocument()
        }
      )

      it.each`
        isDesktopViewport
        ${true}
        ${false}
      `(
        'should not render error message when booking is no ticket and isDesktopViewport is $isDesktopViewport',
        async ({ isDesktopViewport }) => {
          renderBookingDetailsWithBookingById({
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
            ).not.toBeInTheDocument()
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
          renderBookingDetailsWithBookingById({ booking: ongoingBookingV2, isDesktopViewport })

          expect(
            screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
          ).toBeInTheDocument()
        }
      )
    })
  })
})

const renderBookingDetails = (booking: Booking) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingReponse | null>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}

const renderBookingDetailsWithBookingById = ({
  booking,
  isDesktopViewport,
}: {
  booking?: BookingResponse
  isDesktopViewport?: boolean
}) => {
  jest.spyOn(useBookingByIdQueryAPI, 'useBookingByIdQuery').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingResponse | null, Error>)

  return render(reactQueryProviderHOC(<BookingDetails />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
}
