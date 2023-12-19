import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferPlace, OfferPlaceProps } from 'features/offer/components/OfferPlace/OfferPlace'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
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

const useFeatureFlagSpy = jest
  .spyOn(useFeatureFlag, 'useFeatureFlag')
  // this value corresponds to WIP_ENABLE_MULTIVENUE_OFFER feature flag
  .mockReturnValue(false)

const offerPlaceProps: OfferPlaceProps = {
  offer: mockOffer,
  geolocPosition: null,
  isMultivenueCompatibleOffer: false,
  showVenueBanner: true,
  fullAddress: 'Rue de la paix, 75000 Paris',
  venueSectionTitle: 'Lieu de retrait',
}

describe('<OfferPlace />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2021-01-01'))
    mockVenueList = []
    mockNbVenueItems = 0
  })

  describe('When wipEnableMultivenueOffer feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
    })

    it('should show venue banner in where section', () => {
      renderOfferPlace(offerPlaceProps)

      expect(screen.getByTestId(`Lieu ${mockOffer.venue.name}`)).toBeOnTheScreen()
    })

    it('should log when the user press the venue banner', () => {
      renderOfferPlace(offerPlaceProps)

      fireEvent.press(screen.getByTestId(`Lieu ${mockOffer.venue.name}`))

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: mockOffer.venue.id,
        from: 'offer',
      })
    })

    it('should not display distance when no address and go to button', () => {
      const venueWithoutAddress = {
        id: 1,
        offerer: { name: 'PATHE BEAUGRENELLE' },
        name: 'PATHE BEAUGRENELLE',
        coordinates: {},
        isPermanent: true,
        timezone: 'Europe/Paris',
      }

      renderOfferPlace({
        ...offerPlaceProps,
        offer: {
          ...mockOffer,
          venue: venueWithoutAddress,
        },
      })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
      expect(screen.queryByText('Distance')).not.toBeOnTheScreen()
    })

    it('should log when the users consult the itinerary', () => {
      renderOfferPlace(offerPlaceProps)

      fireEvent.press(screen.getByText('Voir l’itinéraire'))

      expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
        offerId: mockOffer.id,
        from: 'offer',
      })
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques" and offer has an EAN', () => {
      renderOfferPlace({
        ...offerPlaceProps,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier" and offer has an EAN', () => {
      renderOfferPlace({
        ...offerPlaceProps,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is not "Livres papier" or "Livres audio physiques"', () => {
      renderOfferPlace(offerPlaceProps)

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should display old venue section', () => {
      renderOfferPlace(offerPlaceProps)

      expect(screen.queryByText('Où\u00a0?')).toBeOnTheScreen()
    })

    it('should not display new venue section', () => {
      renderOfferPlace(offerPlaceProps)

      expect(screen.queryByTestId('venueCard')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('venueInfos')).not.toBeOnTheScreen()
    })
  })

  describe('When wipEnableMultivenueOffer feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are other venues offering the same offer', () => {
      mockNbVenueItems = 2
      mockVenueList = offerVenues
      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.getByText('Voir d’autres lieux disponibles')).toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are not other venues offering the same offer', () => {
      mockNbVenueItems = 0
      mockVenueList = []
      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques" and offer has not an EAN', () => {
      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
      mockNbVenueItems = 2
      mockVenueList = offerVenues
      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.getByText('Voir d’autres lieux disponibles')).toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
      mockNbVenueItems = 0
      mockVenueList = []
      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier" and offer has not an EAN', () => {
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
      })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display other venues available button when offer subcategory is not "Livres papier" or "Livres audio physiques"', () => {
      renderOfferPlace({ ...offerPlaceProps, isMultivenueCompatibleOffer: true })

      expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
    })

    it('should not display old venue section', () => {
      renderOfferPlace({ ...offerPlaceProps, isMultivenueCompatibleOffer: true })

      expect(screen.queryByText('Où\u00a0?')).not.toBeOnTheScreen()
    })

    describe('should display new venue section', () => {
      it('With "Lieu de retrait" in title by default', () => {
        renderOfferPlace({
          ...offerPlaceProps,
          isMultivenueCompatibleOffer: true,
          offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })

        expect(screen.queryByText('Lieu de retrait')).toBeOnTheScreen()
      })
    })

    it('should navigate to an other offer when user choose an other venue from "Voir d’autres lieux disponibles" button', () => {
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
        isMultivenueCompatibleOffer: true,
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
        isMultivenueCompatibleOffer: true,
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

    it('should log when the users press the change venue modal', () => {
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderOfferPlace({
        ...offerPlaceProps,
        isMultivenueCompatibleOffer: true,
        offer: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: {
            ean: '2765410054',
          },
        },
      })

      fireEvent.press(screen.getByText('Voir d’autres lieux disponibles'))

      expect(analytics.logMultivenueOptionDisplayed).toHaveBeenCalledWith(mockOffer.id)
    })
  })
})

const renderOfferPlace = ({
  offer,
  geolocPosition,
  isMultivenueCompatibleOffer,
  showVenueBanner,
  fullAddress,
  venueSectionTitle,
}: OfferPlaceProps) =>
  render(
    reactQueryProviderHOC(
      <OfferPlace
        offer={offer}
        geolocPosition={geolocPosition}
        isMultivenueCompatibleOffer={isMultivenueCompatibleOffer}
        showVenueBanner={showVenueBanner}
        fullAddress={fullAddress}
        venueSectionTitle={venueSectionTitle}
      />
    )
  )
