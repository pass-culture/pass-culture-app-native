import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferPlace, OfferPlaceProps } from 'features/offer/components/OfferPlace/OfferPlace'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { ILocationContext, LocationMode } from 'libs/location/types'
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

const baseValueSearchVenueOffer = {
  hasNextPage: true,
  fetchNextPage: jest.fn(),
  data: {
    pages: [
      {
        nbHits: 0,
        hits: [],
        page: 0,
      },
    ],
  },
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

jest
  .spyOn(useFeatureFlag, 'useFeatureFlag')
  // this value corresponds to WIP_ENABLE_MULTIVENUE_OFFER feature flag
  .mockReturnValue(true)

const offerPlaceProps: OfferPlaceProps = {
  offer: mockOffer,
  isEvent: false,
}

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockUseLocation = jest.fn(
  (): Partial<ILocationContext> => ({
    selectedLocationMode: LocationMode.EVERYWHERE,
    place: null,
  })
)
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('<OfferPlace />', () => {
  beforeEach(() => {
    mockDistance = null
    mockdate.set(new Date('2021-01-01'))
    mockUseSearchVenueOffers.mockReturnValue(searchVenueOfferWithVenues)
  })

  it('should display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are other venues offering the same offer', () => {
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

  it('should display change venue button when offer subcategory is "Seance cine", offer has an allocineId and that there are other venues offering the same offer', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        extraData: { allocineId: 2765410054 },
      },
    })

    expect(screen.getByText('Changer de cinéma')).toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Seance cine", offer has not an allocineId', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        extraData: { allocineId: undefined },
      },
    })

    expect(screen.queryByText('Changer de cinéma')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are not other venues offering the same offer', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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

  it('should not display change venue button when offer subcategory is "Livres audio" and offer has not an EAN', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
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
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)

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
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is not "Livres papier" or "Livres audio"', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace(offerPlaceProps)

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display venue block With "Lieu de retrait" in title by default', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.getByText('Lieu de retrait')).toBeOnTheScreen()
  })

  it('should navigate to an other offer when user choose an other venue from "Changer le lieu de retrait" button', () => {
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

  it('should log when the users press "Changer le lieu de retrait" button', () => {
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
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    mockDistance = '7 km'
    renderOfferPlace({})

    expect(screen.getByText('à 7 km')).toBeOnTheScreen()
  })

  it('should not display venue tag distance when user not share his position', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({})

    expect(screen.queryByText('à 7 km')).not.toBeOnTheScreen()
  })

  it('should not display "Voir la page du lieu" button when venue is not permanent', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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

    it('should navigate to venue page when pressing venue button', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      renderOfferPlace({ offer })

      fireEvent.press(screen.getByTestId('RightFilled'))

      expect(navigate).toHaveBeenCalledWith('Venue', { id: mockOffer.venue.id })
    })

    it('should log ConsultVenue when pressing venue button', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      renderOfferPlace({ offer })

      fireEvent.press(screen.getByTestId('RightFilled'))

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: mockOffer.venue.id,
        from: 'offer',
      })
    })
  })

  it('should display "Voir l’itinéraire" button when complete venue address specified', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
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
        mockUseLocation
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })
        mockDistance = null
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
          fireEvent.press(screen.getByText('Changer le lieu de retrait'))
        })

        expect(screen.getByText(headerMessage)).toBeOnTheScreen()
      }
    )
  })

  it('should display container with divider on mobile', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByTestId('place-container-with-divider')).toBeOnTheScreen()
  })

  it('should not display container with divider on desktop', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
      isDesktopViewport: true,
    })

    expect(screen.queryByTestId('place-container-with-divider')).not.toBeOnTheScreen()
  })

  it('should display container without divider on desktop', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
      isDesktopViewport: true,
    })

    expect(screen.getByTestId('place-container-without-divider')).toBeOnTheScreen()
  })

  it('should not display container without divider on mobile', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByTestId('place-container-without-divider')).not.toBeOnTheScreen()
  })
})

type RenderOfferPlaceType = Partial<ComponentProps<typeof OfferPlace>> & {
  isDesktopViewport?: boolean
}

const renderOfferPlace = ({
  offer = mockOffer,
  isEvent = false,
  isDesktopViewport,
}: RenderOfferPlaceType) =>
  render(reactQueryProviderHOC(<OfferPlace offer={offer} isEvent={isEvent} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
