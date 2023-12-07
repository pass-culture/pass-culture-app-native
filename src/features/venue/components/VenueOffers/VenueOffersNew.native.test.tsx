import mockdate from 'mockdate'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { VenueOffersNew } from 'features/venue/components/VenueOffers/VenueOffersNew'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const playlists = gtlPlaylistAlgoliaSnapshot
const mockVenue = venueResponseSnap
const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')

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
  locationFilter: {
    locationType: LocationType.EVERYWHERE,
  },
}

const venueOffersMock = { hits: VenueOffersResponseSnap, nbHits: 4 }

const distributionStoreVenue = {
  ...mockVenue,
  venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE,
}

const bookstoreVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE }

describe('<VenueOffersNew />', () => {
  it('should render correctly', () => {
    renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: venueOffersMock })

    expect(screen).toMatchSnapshot()
  })

  it('should display placeholder when no offers', () => {
    renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: { hits: [], nbHits: 0 } })

    expect(
      screen.getByText('Il n’y a pas encore d’offre disponible dans ce lieu')
    ).toBeOnTheScreen()
  })

  it('should display "En voir plus" button if they are more hits to see than the one displayed', () => {
    renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: venueOffersMock })

    expect(screen.queryByText('En voir plus')).toBeOnTheScreen()
  })

  it(`should not display "En voir plus" button if they are no more hits to see than the one displayed`, () => {
    renderVenueOffersNew({
      venue: venueResponseSnap,
      venueOffers: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    })

    expect(screen.queryByText('En voir plus')).not.toBeOnTheScreen()
  })

  it(`should go to search page with venue infos when clicking "En voir plus" button`, async () => {
    renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: venueOffersMock })

    fireEvent.press(screen.getByText('En voir plus'))

    await act(() => {})

    expect(push).toHaveBeenCalledWith('TabNavigator', {
      params: {
        ...defaultParams,
        venue: {
          geolocation: { latitude: 48.87004, longitude: 2.3785 },
          info: 'Paris',
          label: 'Le Petit Rintintin 1',
          venueId: 5543,
        },
        view: SearchView.Results,
        previousView: SearchView.Results,
      },
      screen: 'Search',
    })
  })

  it(`should log analytics event when clicking "En voir plus" button`, () => {
    renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: venueOffersMock })
    fireEvent.press(screen.getByText('En voir plus'))

    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  describe('should display all gtl playlists', () => {
    it('When there are gtl playlists associated to the venue and venue type is distribution store', () => {
      renderVenueOffersNew({ venue: bookstoreVenue, venueOffers: venueOffersMock, playlists })

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is book store', () => {
      renderVenueOffersNew({
        venue: distributionStoreVenue,
        venueOffers: venueOffersMock,
        playlists,
      })

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })
  })

  it('should display only 10 gtl playlists when there are more to display', () => {
    const moreThan10Playlists = [...Array(11)].map((_, index) => ({
      ...playlists[0],
      title: playlists[0].title + index,
    }))
    renderVenueOffersNew({
      venue: distributionStoreVenue,
      venueOffers: venueOffersMock,
      playlists: moreThan10Playlists,
    })

    expect(screen.getAllByText(/GTL playlist.+/)).toHaveLength(10)
  })

  describe('should not display all gtl playlists', () => {
    it('When there are not gtl playlists associated to the venue and venue type is distribution store', () => {
      renderVenueOffersNew({ venue: bookstoreVenue, venueOffers: venueOffersMock })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are not gtl playlists associated to the venue and venue type is book store', () => {
      renderVenueOffersNew({ venue: distributionStoreVenue, venueOffers: venueOffersMock })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is not distribution or book store', () => {
      renderVenueOffersNew({ venue: venueResponseSnap, venueOffers: venueOffersMock, playlists })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })
  })
})

const renderVenueOffersNew = ({
  venue,
  venueOffers,
  playlists,
}: {
  venue: VenueResponse
  venueOffers: { hits: Offer[]; nbHits: number }
  playlists?: GTLPlaylistResponse
}) => {
  return render(
    reactQueryProviderHOC(
      <VenueOffersNew venue={venue} venueOffers={venueOffers} playlists={playlists} />
    )
  )
}
