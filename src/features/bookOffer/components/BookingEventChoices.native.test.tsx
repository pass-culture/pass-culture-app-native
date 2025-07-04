import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { BookingEventChoices } from './BookingEventChoices'

jest.mock('libs/firebase/analytics/analytics')
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

const mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => ({
    price: 2000,
    id: '148409',
    beginningDatetime: new Date('2021-03-02T20:00:00'),
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<BookingEventChoices />', () => {
  beforeEach(() => {
    mockServer.getApi<OfferResponseV2>(`/v2/offer/116656`, offerResponseSnap)
    setFeatureFlags()
  })

  beforeAll(() => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      id: 1,
      domainsCredit: { all: { remaining: 30000, initial: 50000 }, physical: null, digital: null },
    })
  })

  describe('when step is date', () => {
    beforeAll(() => {
      mockUseBooking.mockImplementation(() => ({
        bookingState: {
          offerId: 116656,
          step: Step.DATE,
        },
        dispatch: jest.fn(),
      }))
    })

    it('should display date selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('DateStep')).toBeOnTheScreen()
    })

    it('should not display hour selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display duo selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display price selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
      })
    })
  })

  describe('When step is hour', () => {
    beforeAll(() => {
      mockUseBooking.mockImplementation(() => ({
        bookingState: {
          offerId: 116656,
          step: Step.HOUR,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
    })

    it('should display hour selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('HourStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display price selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display duo selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
      })
    })
  })

  describe('when step is price', () => {
    beforeAll(() => {
      mockUseBooking.mockImplementation(() => ({
        bookingState: {
          offerId: 116656,
          stockId: 1,
          step: Step.PRICE,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
    })

    it('should display price selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('PricesStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display hour selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display duo selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
      })
    })
  })

  describe('When step is duo', () => {
    beforeAll(() => {
      mockUseBooking.mockImplementation(() => ({
        bookingState: {
          offerId: 116656,
          stockId: 1,
          step: Step.DUO,
          quantity: 1,
          date: '01/02/2021',
        },
        dispatch: jest.fn(),
      }))
    })

    it('should display duo selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      expect(await screen.findByTestId('DuoStep')).toBeOnTheScreen()
    })

    it('should not display date selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('DateStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display hour selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
      })
    })

    it('should not display price selection', async () => {
      render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))

      await waitFor(() => {
        expect(screen.queryByTestId('PricesStep')).not.toBeOnTheScreen()
      })
    })
  })
})
