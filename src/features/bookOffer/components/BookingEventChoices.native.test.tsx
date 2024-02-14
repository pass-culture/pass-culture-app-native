import * as React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { BookingEventChoices } from './BookingEventChoices'

jest.mock('features/auth/context/AuthContext')

const mockUseBooking = useBookingContext as jest.Mock

jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: {
      offerId: undefined,
      stockId: undefined,
      step: undefined,
      quantity: undefined,
      date: undefined,
    },
    dispatch: jest.fn(),
  })),
}))

describe('<BookingEventChoices />', () => {
  beforeAll(() => {
    const mockUseAuthContext = useAuthContext as jest.Mock
    const { user: globalUserMock } = mockUseAuthContext()

    mockUseAuthContext.mockReturnValue({
      user: {
        ...globalUserMock,
        id: 1,
        domainsCredit: { all: { remaining: 30000, initial: 50000 }, physical: null, digital: null },
      },
    })
  })

  describe('when step is date', () => {
    it('should display date selection', () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.DATE,
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.getByTestId('DateStep')).toBeOnTheScreen()
    })

    it('should not display hour selection', () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.DATE,
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
    })

    it('should not display duo selection', () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.DATE,
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
    })

    it('should not display price selection', () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.DATE,
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
    })
  })

  describe('When step is hour', () => {
    it('should display hour selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.HOUR,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('HourStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.HOUR,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
    })

    it('should not display price selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.HOUR,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
    })

    it('should not display duo selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          step: Step.HOUR,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
    })
  })

  describe('when step is price', () => {
    it('should display price selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.PRICE,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('PricesStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.PRICE,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
    })

    it('should not display hour selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.PRICE,
          quantity: undefined,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
    })

    it('should not display duo selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.PRICE,
          quantity: undefined,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await act(async () => {})

      expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
    })
  })

  describe('When step is duo', () => {
    it('should display duo selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.DUO,
          quantity: 1,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.getByTestId('DuoStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.DUO,
          quantity: 1,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
    })

    it('should not display hour selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.DUO,
          quantity: 1,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
    })

    it('should not display price selection', async () => {
      mockUseBooking.mockImplementationOnce(() => ({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.DUO,
          quantity: 1,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
    })
  })
})
