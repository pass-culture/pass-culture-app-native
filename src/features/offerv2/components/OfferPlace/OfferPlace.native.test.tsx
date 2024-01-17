import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferPlaceOldProps } from 'features/offer/components/OfferPlaceOld/OfferPlaceOld'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { OfferPlace } from 'features/offerv2/components/OfferPlace/OfferPlace'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

jest.mock('libs/address/useFormatFullAddress')
const offerVenues = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]
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
let mockVenueList: VenueListItem[] = []
let mockNbVenueItems = 0
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

jest
  .spyOn(useFeatureFlag, 'useFeatureFlag')
  // this value corresponds to WIP_ENABLE_MULTIVENUE_OFFER feature flag
  .mockReturnValue(true)

const offerPlaceProps: OfferPlaceOldProps = {
  offer: mockOffer,
  userLocation: null,
  isEvent: false,
}

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

describe('<OfferPlace />', () => {
  beforeEach(() => {
    mockDistance = null
    mockdate.set(new Date('2021-01-01'))
    mockVenueList = []
    mockNbVenueItems = 0
  })

  it('should display change venue button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are other venues offering the same offer', () => {
    mockNbVenueItems = 2
    mockVenueList = offerVenues
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are not other venues offering the same offer', () => {
    mockNbVenueItems = 0
    mockVenueList = []
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres audio physiques" and offer has not an EAN', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    mockNbVenueItems = 2
    mockVenueList = offerVenues
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    mockNbVenueItems = 0
    mockVenueList = []
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres papier" and offer has not an EAN', () => {
    mockNbVenueItems = 2
    mockVenueList = offerVenues

    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is not "Livres papier" or "Livres audio physiques"', () => {
    renderOfferPlace(offerPlaceProps)

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display venue block With "Lieu de retrait" in title by default', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.queryByText('Lieu de retrait')).toBeOnTheScreen()
  })

  it('should navigate to an other offer when user choose an other venue from "Changer le lieu de retrait" button', () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockNbVenueItems = 2
    mockVenueList = offerVenues

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    fireEvent.press(screen.getByText('Le Livre Éclaire'))
    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(navigate).toHaveBeenCalledWith('Offer', {
      fromOfferId: mockOffer.id,
      id: 2,
      fromMultivenueOfferId: mockOffer.id,
    })
  })

  it('should log ConsultOffer when new offer venue is selected', () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })

    mockNbVenueItems = 2
    mockVenueList = offerVenues

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    fireEvent.press(screen.getByText('Le Livre Éclaire'))
    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      from: 'offer',
      fromMultivenueOfferId: 146112,
      offerId: 2,
    })
  })

  it('should log when the users press "Changer le lieu de retrait" button', () => {
    mockNbVenueItems = 2
    mockVenueList = offerVenues

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: {
          ean: '2765410054',
        },
      },
    })

    fireEvent.press(screen.getByText('Changer le lieu de retrait'))

    expect(analytics.logMultivenueOptionDisplayed).toHaveBeenCalledWith(mockOffer.id)
  })

  it('should display venue tag distance when user share his position', () => {
    mockDistance = '7 km'
    renderOfferPlace({})

    expect(screen.getByText('à 7 km')).toBeOnTheScreen()
  })

  it('should not display venue tag distance when user not share his position', () => {
    renderOfferPlace({})

    expect(screen.queryByText('à 7 km')).not.toBeOnTheScreen()
  })

  it('should not display "Voir la page du lieu" button when venue is not permanent', () => {
    const offer: OfferResponse = {
      ...mockOffer,
      venue: {
        ...mockOffer.venue,
        isPermanent: false,
      },
    }
    renderOfferPlace({ offer })

    expect(screen.queryByText('Voir la page du lieu')).not.toBeOnTheScreen()
  })

  describe('When venue is permanent', () => {
    const offer: OfferResponse = {
      ...mockOffer,
      venue: {
        ...mockOffer.venue,
        isPermanent: true,
      },
    }

    it('should display "Voir la page du lieu" button', () => {
      renderOfferPlace({ offer })

      expect(screen.getByText('Voir la page du lieu')).toBeOnTheScreen()
    })

    it('should navigate to venue page when pressing "Voir la page du lieu" button', () => {
      renderOfferPlace({ offer })

      fireEvent.press(screen.getByText('Voir la page du lieu'))

      expect(navigate).toHaveBeenCalledWith('Venue', { id: mockOffer.venue.id })
    })

    it('should log ConsultVenue when pressing "Voir la page du lieu" button', () => {
      renderOfferPlace({ offer })

      fireEvent.press(screen.getByText('Voir la page du lieu'))

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: mockOffer.venue.id,
        from: 'offer',
      })
    })
  })

  it('should display "Voir l’itinéraire" button when complete venue address specified', () => {
    const offer: OfferResponse = {
      ...mockOffer,
      venue: {
        ...mockOffer.venue,
        address: 'RUE DE CALI',
        city: 'Kourou',
        postalCode: '97310',
      },
    }

    renderOfferPlace({ offer })

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  describe('should not display "Voir l’itinéraire" button', () => {
    it('When address, city and postal code not provided', () => {
      const offer: OfferResponse = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: undefined,
          postalCode: undefined,
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('When only address provided', () => {
      const offer: OfferResponse = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: 'RUE DE CALI',
          city: undefined,
          postalCode: undefined,
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('When only city provided', () => {
      const offer: OfferResponse = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: 'Kourou',
          postalCode: undefined,
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('When only city postalCode', () => {
      const offer: OfferResponse = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: undefined,
          postalCode: '97310',
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })
  })

  it('should log consult itinerary when pressing "Voir l’itinéraire" button', () => {
    const offer: OfferResponse = {
      ...mockOffer,
      id: 146112,
    }
    renderOfferPlace({ offer })

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toHaveBeenNthCalledWith(1, {
      from: 'offer',
      offerId: 146112,
    })
  })
})

type RenderOfferPlaceType = Partial<ComponentProps<typeof OfferPlace>>

const renderOfferPlace = ({
  offer = mockOffer,
  userLocation,
  isEvent = false,
}: RenderOfferPlaceType) =>
  render(
    reactQueryProviderHOC(
      <OfferPlace offer={offer} userLocation={userLocation} isEvent={isEvent} />
    )
  )
