import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BookingReponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import * as ongoingOrEndedBookingAPI from 'features/bookings/api/useOngoingOrEndedBooking'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as bookingPropertiesAPI from 'features/bookings/helpers/getBookingProperties'
import { Booking } from 'features/bookings/types'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/firebase/analytics'
import * as OpenItinerary from 'libs/itinerary/useOpenItinerary'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, flushAllPromisesWithAct, fireEvent, render } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockSnackBarTimeout = SNACK_BAR_TIME_OUT

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const mockShowInfoSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({
    showInfoSnackBar: mockShowInfoSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  })),
  SNACK_BAR_TIME_OUT: mockSnackBarTimeout,
}))

let mockBookings = { ...bookingsSnap }

jest.mock('features/bookings/api/useBookings', () => ({
  useBookings: jest.fn(() => ({
    data: mockBookings,
  })),
}))

describe('BookingDetails', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(() => {
    jest.restoreAllMocks()
    mockBookings = { ...bookingsSnap }
  })

  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        id: 456,
      },
    }))
  })

  it('should call useOngoingOrEndedBooking with the right parameters', () => {
    const useOngoingOrEndedBooking = jest.spyOn(
      ongoingOrEndedBookingAPI,
      'useOngoingOrEndedBooking'
    )

    const booking = bookingsSnap.ongoing_bookings[0]
    renderBookingDetails(booking)
    expect(useOngoingOrEndedBooking).toBeCalledWith(456)
  })

  it('should render correctly', async () => {
    const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
    booking.completedUrl = 'https://example.com'
    const { toJSON } = renderBookingDetails(booking)
    expect(toJSON()).toMatchSnapshot()
  })

  describe('<DetailedBookingTicket />', () => {
    it('should display booking token', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const { queryByText } = renderBookingDetails(booking)
      expect(queryByText('352UW4')).toBeTruthy()
    })

    it('should display offer link button if offer is digital and open url on press', async () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking.stock.offer.isDigital = true
      booking.completedUrl = 'https://example.com'

      const { getByText } = renderBookingDetails(booking)
      const offerButton = getByText('Accéder à l’offre')
      await fireEvent.press(offerButton)

      expect(mockedOpenUrl).toHaveBeenCalledWith(
        booking.completedUrl,
        {
          analyticsData: {
            offerId: booking.stock.offer.id,
          },
        },
        true
      )
    })

    it('should not display offer link button if no url', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const { queryByText } = renderBookingDetails(booking)
      expect(queryByText("Accéder à l'offre")).toBeNull()
    })

    it('should display booking qr code if offer is physical', async () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking.stock.offer.isDigital = false
      const { queryByTestId } = renderBookingDetails(booking)
      expect(queryByTestId('qr-code')).toBeTruthy()
    })

    it('should display EAN code if offer is a book (digital or physical)', async () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.LIVRE_PAPIER
      const { queryByText } = renderBookingDetails(booking)
      expect(queryByText('123456789')).toBeTruthy()
    })
  })

  describe('Offer rules', () => {
    it('should display rules for a digital offer', () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking.stock.offer.isDigital = true

      const { queryByText } = renderBookingDetails(booking)

      expect(
        queryByText(
          'Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
        )
      ).toBeTruthy()
    })

    it('should display rules for a digital offer with activation code', () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking.stock.offer.isDigital = true
      booking.activationCode = {
        code: 'fdfdfsds',
      }

      const { queryByText } = renderBookingDetails(booking)

      expect(
        queryByText(
          'Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
        )
      ).toBeTruthy()
    })

    it.each([
      ['event', true, WithdrawalTypeEnum.on_site],
      ['physical', false, null],
    ])('should display rules for a %s & non-digital offer', (type, isEvent, withdrawalType) => {
      let booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      booking = {
        ...booking,
        stock: { ...booking.stock, offer: { ...booking.stock.offer, withdrawalType } },
      }
      jest
        .spyOn(bookingPropertiesAPI, 'getBookingProperties')
        .mockReturnValue({ isEvent, isDigital: false, isPhysical: !isEvent })

      const { queryByText } = renderBookingDetails(booking)

      expect(
        queryByText(
          'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
        )
      ).toBeTruthy()
    })
  })

  describe('withdrawalDetails', () => {
    it('should display withdrawal details', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.withdrawalDetails = 'Voici comment récupérer ton bien'
      const { queryByText } = renderBookingDetails(booking)

      expect(queryByText('Modalités de retrait')).toBeTruthy()
      expect(queryByText(booking.stock.offer.withdrawalDetails)).toBeTruthy()
    })

    it('should not display withdrawal details', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.withdrawalDetails = undefined
      const { queryByTestId, queryByText } = renderBookingDetails(booking)

      const title = queryByText('Modalités de retrait')
      const withdrawalText = queryByTestId('withdrawalDetails')

      expect(title).toBeFalsy()
      expect(withdrawalText).toBeFalsy()
    })
  })

  it('should redirect to the Offer page and log event', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = renderBookingDetails(booking)

    const text = getByText('Voir le détail de l’offre')
    await fireEvent.press(text)

    const offerId = booking.stock.offer.id

    expect(navigate).toBeCalledWith('Offer', {
      id: offerId,
      from: 'bookingdetails',
    })
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId, from: 'bookings' })
  })

  it('should not redirect to the Offer and showSnackBarError when not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = renderBookingDetails(booking)

    const text = getByText('Voir le détail de l’offre')
    await fireEvent.press(text)

    const offerId = booking.stock.offer.id

    expect(navigate).not.toBeCalledWith('Offer', {
      id: offerId,
      from: 'bookingdetails',
    })
    expect(analytics.logConsultOffer).not.toHaveBeenCalledWith({ offerId, from: 'bookings' })
    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: `Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
  describe('cancellation button', () => {
    it('should log event "CancelBooking" when cancelling booking', async () => {
      const booking = cloneDeep(bookingsSnap.ongoing_bookings[0])
      const date = new Date()
      date.setDate(date.getDate() + 1)
      booking.confirmationDate = date.toISOString()
      const { getAllByTestId } = renderBookingDetails(booking)
      await fireEvent.press(getAllByTestId('Annuler ma réservation')[0])

      expect(analytics.logCancelBooking).toHaveBeenCalledWith(booking.stock.offer.id)
    })
  })

  describe('cancellation message and navigation to ended booking', () => {
    describe('should display it and navigate', () => {
      beforeEach(() => {
        useRoute.mockImplementation(() => ({
          params: {
            id: 321,
          },
        }))
      })

      it('when booking is digital with expiration date', () => {
        const booking = {
          ...mockBookings.ended_bookings[0],
          expirationDate: '2021-03-17T23:01:37.925926',
        }

        mockBookings = {
          ...mockBookings,
          ended_bookings: [booking],
        }

        const nameCanceledBooking = booking.stock.offer.name
        renderBookingDetails(booking)

        expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
          message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
          timeout: SNACK_BAR_TIME_OUT,
        })
        expect(navigate).toHaveBeenCalledWith('EndedBookings')
      })

      it('when booking is not digital with expiration date', () => {
        const mockedBooking = mockBookings.ended_bookings[0]

        const booking = {
          ...mockedBooking,
          expirationDate: '2021-03-17T23:01:37.925926',
          stock: {
            ...mockedBooking.stock,
            offer: { ...mockedBooking.stock.offer, isDigital: false },
          },
        }

        mockBookings = {
          ...mockBookings,
          ended_bookings: [booking],
        }

        const nameCanceledBooking = booking.stock.offer.name
        renderBookingDetails(booking)

        expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
          message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
          timeout: SNACK_BAR_TIME_OUT,
        })
        expect(navigate).toHaveBeenCalledWith('EndedBookings')
      })

      it('when booking is not digital without expiration date', () => {
        const mockedBooking = mockBookings.ended_bookings[0]

        const booking = {
          ...mockedBooking,
          expirationDate: null,
          stock: {
            ...mockedBooking.stock.offer,
            offer: { ...mockedBooking.stock.offer, isDigital: false },
          },
        }

        mockBookings = {
          ...mockBookings,
          ended_bookings: [booking],
        }

        const nameCanceledBooking = booking.stock.offer.name
        renderBookingDetails(booking)

        expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
          message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
          timeout: SNACK_BAR_TIME_OUT,
        })
        expect(navigate).toHaveBeenCalledWith('EndedBookings')
      })
    })

    it('should not display it and not navigate when booking is digital without expiration date', () => {
      const booking = { ...mockBookings.ended_bookings[0] }
      renderBookingDetails(booking)

      expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe('booking not found', () => {
    it('should render ScreenError BookingNotFound when booking is not found when data already exists', async () => {
      // We allow this console error because throwing an error when no booking is found 404
      jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)

      const renderAPI = renderBookingDetails(undefined, {
        dataUpdatedAt: new Date().getTime(),
      })
      expect(renderAPI.queryByText('Réservation introuvable !')).toBeTruthy()
      expect(
        renderAPI.queryByText(
          `Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N’hésite pas à retrouver la liste de tes réservations terminées et annulées pour t’en assurer.`
        )
      ).toBeTruthy()
      expect(renderAPI.queryByText('Mes réservations terminées')).toBeTruthy()
      expect(renderAPI.queryByText(`Retourner à l’accueil`)).toBeTruthy()

      await fireEvent.press(renderAPI.getByText('Mes réservations terminées'))
      expect(navigate).toBeCalledWith('EndedBookings', undefined)

      await fireEvent.press(renderAPI.getByText(`Retourner à l’accueil`))
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })

    it('should not render ScreenError BookingNotFound when booking is not found and no data exists', () => {
      const renderAPI = renderBookingDetails(undefined, {
        dataUpdatedAt: 0,
      })
      expect(renderAPI.queryByText('Réservation introuvable\u00a0!')).toBeNull()
    })
  })

  describe('Itinerary', () => {
    it.each([
      ['isEvent == true', { isEvent: true }],
      ['isPhysical == true', { isPhysical: true, isDigital: false }],
    ])('should render the itinerary button when %s', (_testLabel, dataProvider) => {
      const openItinerary = jest.spyOn(OpenItinerary, 'default').mockReturnValue({
        openItinerary: jest.fn(),
        canOpenItinerary: true,
      })
      const getBookingProperties = jest
        .spyOn(bookingPropertiesAPI, 'getBookingProperties')
        .mockReturnValue(dataProvider)

      const booking = bookingsSnap.ongoing_bookings[0]
      const { queryByText } = renderBookingDetails(booking)

      const itineraryButton = queryByText('Voir l’itinéraire')
      expect(itineraryButton).toBeTruthy()

      openItinerary.mockRestore()
      getBookingProperties.mockRestore()
    })

    it.each([
      ['canOpenItinerary == false', false, {}],
      [
        'canOpenItinerary == true && isEvent == false && isPhysical == false',
        true,
        { isEvent: false, isPhysical: false },
      ],
      [
        'canOpenItinerary == true && isEvent == false && isPhysical == true && isDigital == true',
        true,
        { isEvent: false, isPhysical: true, isDigital: true },
      ],
    ])(
      'should not render the itinerary button when %s',
      (_testLabel, canOpenItinerary, dataProvider) => {
        const openItinerary = jest.spyOn(OpenItinerary, 'default').mockReturnValue({
          openItinerary: jest.fn(),
          canOpenItinerary,
        })
        const getBookingProperties = jest
          .spyOn(bookingPropertiesAPI, 'getBookingProperties')
          .mockReturnValue(dataProvider)

        const booking = bookingsSnap.ongoing_bookings[0]
        const { queryByText } = renderBookingDetails(booking)
        const itineraryButton = queryByText('Voir l’itinéraire')
        expect(itineraryButton).toBeFalsy()

        openItinerary.mockRestore()
        getBookingProperties.mockRestore()
      }
    )
  })

  describe('Analytics', () => {
    it('should trigger logEvent "BookingDetailsScrolledToBottom" when reaching the end', async () => {
      const nativeEventMiddle = {
        layoutMeasurement: { height: 1000 },
        contentOffset: { y: 400 }, // how far did we scroll
        contentSize: { height: 1600 },
      }
      const nativeEventBottom = {
        layoutMeasurement: { height: 1000 },
        contentOffset: { y: 900 },
        contentSize: { height: 1600 },
      }

      const booking = bookingsSnap.ongoing_bookings[0]
      const { getByTestId } = renderBookingDetails(booking)
      const scrollView = getByTestId('BookingDetailsScrollView')
      await flushAllPromisesWithAct()

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      })
      expect(analytics.logBookingDetailsScrolledToBottom).not.toHaveBeenCalled()

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })

      expect(analytics.logBookingDetailsScrolledToBottom).toHaveBeenCalledTimes(1)
    })
  })
})

function renderBookingDetails(booking?: Booking, options = {}) {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBooking').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    ...options,
  } as unknown as UseQueryResult<BookingReponse | null>)
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<BookingDetails />))
}
