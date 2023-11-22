import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { SearchView } from 'features/search/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffersNew } from 'features/venue/components/VenueOffers/VenueOffersNew'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const playlists = gtlPlaylistAlgoliaSnapshot
const mockVenue = venueResponseSnap
const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
const mockUseVenue = jest.mocked(useVenue)

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
  date: null,
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

describe('<VenueOffersNew />', () => {
  afterEach(() => {
    mockUseVenue.mockReturnValue({ data: venueResponseSnap } as UseQueryResult<
      VenueResponse,
      unknown
    >)
  })

  it('should render correctly', () => {
    renderVenueOffersNew(venueId)

    expect(screen).toMatchSnapshot()
  })

  it('should be null when no offers', () => {
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: [], nbHits: 0 },
    } as unknown as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)
    renderVenueOffersNew(venueId)

    expect(screen.toJSON()).toBeNull()
  })

  it('should display "En voir plus" button if they are more hits to see than the one displayed', () => {
    renderVenueOffersNew(venueId)

    expect(screen.queryByText('En voir plus')).toBeOnTheScreen()
  })

  it(`should not display "En voir plus" button if they are no more hits to see than the one displayed`, () => {
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    } as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)

    renderVenueOffersNew(venueId)

    expect(screen.queryByText('En voir plus')).not.toBeOnTheScreen()
  })

  it(`should go to search page with venue infos when clicking "En voir plus" button`, async () => {
    renderVenueOffersNew(venueId)

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

  it(`should log analytics event when clicking "En voir plus" button`, () => {
    renderVenueOffersNew(venueId)
    fireEvent.press(screen.getByText('En voir plus'))

    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  describe('should display all gtl playlists', () => {
    it('When there are gtl playlists associated to the venue and venue type is distribution store', () => {
      doMockUseVenue({ ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE })
      renderVenueOffersNew(venueId, playlists)

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is book store', () => {
      doMockUseVenue({ ...mockVenue, venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE })
      renderVenueOffersNew(venueId, playlists)

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })
  })

  it('should display only 10 gtl playlists when there are more to display', () => {
    doMockUseVenue({ ...mockVenue, venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE })
    const moreThan10Playlists = [...Array(11)].map((_, index) => ({
      ...playlists[0],
      title: playlists[0].title + index,
    }))
    renderVenueOffersNew(venueId, moreThan10Playlists)

    expect(screen.getAllByText(/GTL playlist.+/)).toHaveLength(10)
  })

  describe('should not display all gtl playlists', () => {
    it('When there are not gtl playlists associated to the venue and venue type is distribution store', () => {
      doMockUseVenue({ ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE })
      renderVenueOffersNew(venueId)

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are not gtl playlists associated to the venue and venue type is book store', () => {
      doMockUseVenue({ ...mockVenue, venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE })
      renderVenueOffersNew(venueId)

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is not distributon or book store', () => {
      renderVenueOffersNew(venueId, playlists)

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })
  })
})

const doMockUseVenue = (venue: VenueResponse) => {
  mockUseVenue.mockReturnValue({ data: venue } as UseQueryResult<VenueResponse, unknown>)
}

const renderVenueOffersNew = (venueId: number, playlists?: GTLPlaylistResponse) => {
  return render(reactQueryProviderHOC(<VenueOffersNew venueId={venueId} playlists={playlists} />))
}
