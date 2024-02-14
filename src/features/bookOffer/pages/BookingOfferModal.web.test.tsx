import React from 'react'

import { Step } from 'features/bookOffer/context/reducer'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act, waitFor } from 'tests/utils/web'

import { BookingOfferModalComponent } from './BookingOfferModal'

jest.mock('features/auth/context/AuthContext')
jest.mock('features/bookOffer/helpers/useBookingStock')

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

let mockStep: Step | undefined = undefined
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: {
      step: mockStep,
      quantity: 2,
      date: new Date('2021-03-02T20:00:00'),
    },
    dispatch: jest.fn(),
    dismissModal: jest.fn(),
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
const mockOfferVenues: VenueListItem[] = []
const mockNbOfferVenues = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    offerVenues: mockOfferVenues,
    nbOfferVenues: mockNbOfferVenues,
    isFetching: false,
  }),
}))

describe('<BookingOfferModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for step "date"', async () => {
      mockStep = Step.DATE
      const { container } = render(
        reactQueryProviderHOC(<BookingOfferModalComponent offerId={mockOffer.id} visible />)
      )

      await waitFor(async () => {
        let results
        await act(async () => {
          results = await checkAccessibilityFor(container)
        })

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues for step "hour"', async () => {
      mockStep = Step.HOUR
      const { container } = render(
        reactQueryProviderHOC(<BookingOfferModalComponent offerId={mockOffer.id} visible />)
      )

      await waitFor(async () => {
        let results
        await act(async () => {
          results = await checkAccessibilityFor(container)
        })

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues for step "duo"', async () => {
      mockStep = Step.DUO
      const { container } = render(
        reactQueryProviderHOC(<BookingOfferModalComponent offerId={mockOffer.id} visible />)
      )

      await waitFor(async () => {
        let results
        await act(async () => {
          results = await checkAccessibilityFor(container)
        })

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues for step "confirmation"', async () => {
      mockStep = Step.CONFIRMATION
      const { container } = render(
        reactQueryProviderHOC(<BookingOfferModalComponent offerId={mockOffer.id} visible />)
      )

      await waitFor(async () => {
        let results
        await act(async () => {
          results = await checkAccessibilityFor(container)
        })

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues for ended used booking', async () => {
      const { container } = render(
        reactQueryProviderHOC(
          <BookingOfferModalComponent offerId={mockOffer.id} isEndedUsedBooking visible />
        )
      )

      await waitFor(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
