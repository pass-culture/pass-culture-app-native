import userEvent from '@testing-library/user-event'
import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
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
const mockVenueList: VenueListItem[] = []
const mockNbVenueItems = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

const openURLSpy = jest.spyOn(Linking, 'openURL')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const offerId = 1

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })

  describe('share on social media', () => {
    it('should open url to share on social medium', async () => {
      render(<OfferBody offerId={offerId} onScroll={jest.fn()} />)

      await userEvent.click(await screen.findByText('Envoyer sur WhatsApp'))

      const offerUrl = getOfferUrl(offerId)
      const expectedMessage = `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture\n${offerUrl}`
      expect(openURLSpy).toHaveBeenNthCalledWith(
        1,
        `https://api.whatsapp.com/send?text=${encodeURIComponent(expectedMessage)}`
      )
    })

    it('should open web share modal on "Plus d’options" press', async () => {
      render(<OfferBody offerId={offerId} onScroll={jest.fn()} />)

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.click(otherButton)
      })

      expect(screen.queryByText('Partager l’offre')).toBeTruthy()
    })
  })
})
