import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import {
  OfferPlaceOld,
  OfferPlaceOldProps,
} from 'features/offer/components/OfferPlaceOld/OfferPlaceOld'
import { analytics } from 'libs/analytics'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
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

const baseValueSearchVenueOffer = {
  hasNextPage: mockHasNextPage,
  fetchNextPage: mockFetchNextPage,
  data: mockData,
  isFetching: false,
}
const searchVenueOfferEmpty = {
  ...baseValueSearchVenueOffer,
  venueList: [],
  nbVenueItems: 0,
}

const searchVenueOfferWithVenues = {
  ...baseValueSearchVenueOffer,
  venueList: offerVenues,
  nbVenueItems: 2,
}

const mockUseSearchVenueOffers = jest.fn(() => searchVenueOfferWithVenues)

jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => mockUseSearchVenueOffers(),
}))

const offerPlaceProps: OfferPlaceOldProps = {
  offer: mockOffer,
  isEvent: false,
}

let mockSelectedLocationMode = LocationMode.EVERYWHERE
let mockPlace: SuggestedPlace | null = null
jest.mock('libs/location', () => ({
  useLocation: jest.fn(() => ({
    selectedLocationMode: mockSelectedLocationMode,
    place: mockPlace,
  })),
}))

describe('<OfferPlace />', () => {
  beforeEach(() => {
    mockdate.set(new Date('2021-01-01'))
    mockUseSearchVenueOffers.mockReturnValue(searchVenueOfferWithVenues)
  })

  it('should display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are other venues offering the same offer', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Voir d’autres lieux disponibles')).toBeOnTheScreen()
  })

  it('should not display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are not other venues offering the same offer', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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

  it('should not display other venues available button when offer subcategory is "Livres audio physiques" and offer has not an EAN', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
    })

    expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
  })

  it('should display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Voir d’autres lieux disponibles')).toBeOnTheScreen()
  })

  it('should not display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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

  it('should not display other venues available button when offer subcategory is "Livres papier" and offer has not an EAN', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
  })

  it('should not display other venues available button when offer subcategory is not "Livres papier" or "Livres audio physiques"', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace(offerPlaceProps)

    expect(screen.queryByText('Voir d’autres lieux disponibles')).not.toBeOnTheScreen()
  })

  it('should not display old venue section', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace(offerPlaceProps)

    expect(screen.queryByText('Où\u00a0?')).not.toBeOnTheScreen()
  })

  describe('should display new venue section', () => {
    it('With "Lieu de retrait" in title by base', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)

      renderOfferPlace({
        ...offerPlaceProps,
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

  it('should log when the users press the change venue modal', () => {
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

    fireEvent.press(screen.getByText('Voir d’autres lieux disponibles'))

    expect(analytics.logMultivenueOptionDisplayed).toHaveBeenCalledWith(mockOffer.id)
  })

  describe('HeaderMessage', () => {
    it.each`
      locationMode                 | place                                                                                             | headerMessage
      ${LocationMode.AROUND_ME}    | ${null}                                                                                           | ${'Lieux disponibles autour de moi'}
      ${LocationMode.EVERYWHERE}   | ${null}                                                                                           | ${'Lieux à proximité de “Cinéma de la fin”'}
      ${LocationMode.AROUND_PLACE} | ${{ label: 'Kourou', info: 'Guyane', geolocation: { longitude: -52.669736, latitude: 5.16186 } }} | ${'Lieux à proximité de “Kourou”'}
    `(
      'should return "$headerMessage" when location mode is $locationMode and place is $place',
      async ({
        locationMode,
        place,
        headerMessage,
      }: {
        locationMode: LocationMode
        place: SuggestedPlace | null
        headerMessage: string
      }) => {
        mockSelectedLocationMode = locationMode
        mockPlace = place
        renderOfferPlace({
          isEvent: false,
          offer: {
            ...mockOffer,
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            extraData: {
              ean: '2765410054',
            },
          },
        })

        await act(async () => {
          fireEvent.press(screen.getByText('Voir d’autres lieux disponibles'))
        })

        expect(screen.getByText(headerMessage)).toBeOnTheScreen()
      }
    )
  })
})

const renderOfferPlace = ({ offer, isEvent }: OfferPlaceOldProps) =>
  render(reactQueryProviderHOC(<OfferPlaceOld offer={offer} isEvent={isEvent} />))
