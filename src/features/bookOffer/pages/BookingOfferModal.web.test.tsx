import React, { ComponentProps } from 'react'

import { Step } from 'features/bookOffer/context/reducer'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { BookingOfferModalComponent } from './BookingOfferModal'

jest.mock('features/auth/context/AuthContext')
jest.mock('features/bookOffer/helpers/useBookingStock')

jest.mock('queries/subcategories/useSubcategoriesQuery')

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

jest.mock('queries/offer/useBookingOfferQuery', () => ({
  useBookingOfferQuery: jest.fn(() => mockOffer),
}))

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
jest.mock('queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery', () => ({
  useSearchVenueOffersInfiniteQuery: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    offerVenues: mockOfferVenues,
    nbOfferVenues: mockNbOfferVenues,
    isFetching: false,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<BookingOfferModal/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      mockServer.getApi(`/v2/offer/${mockOffer.id}`, mockOffer)
    })

    it('should not have basic accessibility issues for step "date"', async () => {
      mockStep = Step.DATE
      const { container } = await renderBookingOfferModalComponent({
        offerId: mockOffer.id,
        visible: true,
      })

      await screen.findByText('Choix des options')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "hour"', async () => {
      mockStep = Step.HOUR
      const { container } = await renderBookingOfferModalComponent({
        offerId: mockOffer.id,
        visible: true,
      })

      await screen.findByText('Choix des options')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "duo"', async () => {
      mockStep = Step.DUO
      const { container } = await renderBookingOfferModalComponent({
        offerId: mockOffer.id,
        visible: true,
      })

      await screen.findByText('Choix des options')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for step "confirmation"', async () => {
      mockStep = Step.CONFIRMATION
      const { container } = await renderBookingOfferModalComponent({
        offerId: mockOffer.id,
        visible: true,
      })

      await screen.findByText('Détails de la réservation')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for ended used booking', async () => {
      const { container } = await renderBookingOfferModalComponent({
        offerId: mockOffer.id,
        visible: true,
        isEndedUsedBooking: true,
      })

      await screen.findByText('Mes réservations terminées')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderBookingOfferModalComponent = async (
  props: ComponentProps<typeof BookingOfferModalComponent>
) =>
  act(async () => {
    return render(reactQueryProviderHOC(<BookingOfferModalComponent {...props} />))
  })
