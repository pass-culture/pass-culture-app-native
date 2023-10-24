import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, VenueTypeCodeKey } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { SearchView } from 'features/search/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')

let mockVenue = venueResponseSnap
jest.mock('features/venue/api/useVenue', () => ({
  useVenue: () => ({ data: mockVenue }),
}))

jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = jest.mocked(useVenueOffers)

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))

const defaultParams = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 30,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  priceRange: [0, 300],
  query: '',
  view: SearchView.Landing,
  tags: [],
  timeRange: null,
}

const playlists: GTLPlaylistResponse = [
  {
    title: 'Test',
    offers: {
      hits: [
        {
          offer: {
            name: 'Mon abonnement bibliothèque',
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '12',
        },
        {
          offer: {
            name: 'Mon abonnement médiathèque',
            subcategoryId: SubcategoryIdEnum.ABO_MEDIATHEQUE,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '13',
        },
        {
          offer: {
            name: 'Mon abonnement livres numériques',
            subcategoryId: SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '14',
        },
        {
          offer: {
            name: 'Mon abonnement ludothèque',
            subcategoryId: SubcategoryIdEnum.ABO_LUDOTHEQUE,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '15',
        },
        {
          offer: {
            name: 'Mon abonnement concert',
            subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '16',
        },
        {
          offer: {
            name: 'Mon abonnement jeu vidéo',
            subcategoryId: SubcategoryIdEnum.ABO_JEU_VIDEO,
          },
          venue: mockVenue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '17',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 1,
      hitsPerPage: 25,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
]

describe('<VenueOffers />', () => {
  afterEach(() => {
    mockVenue = venueResponseSnap
  })

  it('should render correctly', () => {
    render(<VenueOffers venueId={venueId} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display "En voir plus" button if nbHits is more than hits.length', () => {
    render(<VenueOffers venueId={venueId} />)

    expect(screen.queryByText('En voir plus')).toBeOnTheScreen()
  })

  it(`should not display "En voir plus" button if nbHits is same as hits.length`, () => {
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    } as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)

    render(<VenueOffers venueId={venueId} />)

    expect(screen.queryByText('En voir plus')).not.toBeOnTheScreen()
  })

  it(`should set search state when clicking "En voir plus" button`, async () => {
    render(<VenueOffers venueId={venueId} />)

    fireEvent.press(screen.getByText('En voir plus'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...defaultParams,
          locationFilter: {
            locationType: 'VENUE',
            venue: {
              geolocation: { latitude: 48.87004, longitude: 2.3785 },
              info: 'Paris',
              label: 'Le Petit Rintintin 1',
              venueId: 5543,
            },
          },
          view: SearchView.Results,
          previousView: SearchView.Results,
        },
        screen: 'Search',
      })
    })
  })

  it(`should log analytics event VenueSeeMoreClicked when clicking "En voir plus" button`, () => {
    render(<VenueOffers venueId={venueId} />)
    fireEvent.press(screen.getByText('En voir plus'))

    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  it(`should log analytics event VenueSeeAllOffersClicked when clicking "Voir toutes les offres" button`, async () => {
    render(<VenueOffers venueId={venueId} />)
    fireEvent.press(screen.getByText('Voir toutes les offres'))

    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  describe('should display all gtl playlists', () => {
    it('When there are gtl playlists associated to the venue and venue type is distribution store', () => {
      mockVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE }
      render(<VenueOffers venueId={mockVenue.id} playlists={playlists} />)

      expect(screen.getByTestId('allGtlPlaylistsTitle')).toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is book store', () => {
      mockVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE }
      render(<VenueOffers venueId={mockVenue.id} playlists={playlists} />)

      expect(screen.getByTestId('allGtlPlaylistsTitle')).toBeOnTheScreen()
    })
  })

  describe('should not display all gtl playlists', () => {
    it('When there are not gtl playlists associated to the venue and venue type is distribution store', () => {
      mockVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE }
      render(<VenueOffers venueId={mockVenue.id} />)

      expect(screen.queryByTestId('allGtlPlaylistsTitle')).not.toBeOnTheScreen()
    })

    it('When there are not gtl playlists associated to the venue and venue type is book store', () => {
      mockVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE }
      render(<VenueOffers venueId={mockVenue.id} />)

      expect(screen.queryByTestId('allGtlPlaylistsTitle')).not.toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is not distributon or book store', () => {
      render(<VenueOffers venueId={mockVenue.id} playlists={playlists} />)

      expect(screen.queryByTestId('allGtlPlaylistsTitle')).not.toBeOnTheScreen()
    })
  })
})
