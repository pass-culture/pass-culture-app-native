import { SearchResponse } from '@algolia/client-search'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { InViewProps } from 'react-native-intersection-observer'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { GtlPlaylist, GtlPlaylistProps } from 'features/gtlPlaylist/components/GtlPlaylist'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockSubcategories = PLACEHOLDER_DATA.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

const venue: VenueResponse = venueResponseSnap

const playlist: GtlPlaylistProps['playlist'] = {
  title: 'Test',
  offers: {
    hits: [
      {
        offer: {
          name: 'Mon abonnement bibliothèque',
          subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
        },
        venue,
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
        venue,
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
        venue,
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
        venue,
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
        venue,
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
        venue,
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
  minNumberOfOffers: 1,
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

/**
 * This mock permit to simulate the visibility of the playlist
 * it is an alternative solution which allows you to replace the scroll simulation
 * it's not optimal, if you have better idea don't hesitate to update
 */
const mockInView = jest.fn()
jest.mock('react-native-intersection-observer', () => {
  const InView = (props: InViewProps) => {
    mockInView.mockImplementation(props.onChange)
    return null
  }
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView,
  }
})

describe('GtlPlaylist', () => {
  it('should log ConsultOffer when pressing an item', () => {
    render(reactQueryProviderHOC(<GtlPlaylist playlist={playlist} venue={venue} />))

    const result = screen.queryAllByText('Mon abonnement bibliothèque')[0]

    if (result) {
      fireEvent.press(result)
    }

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'venue',
      index: 0,
      moduleId: '2xUlLBRfxdk6jeYyJszunX',
      offerId: 12,
      venueId: 5543,
    })
  })

  it('should log AllTilesSeen only once when scrolling to the end of the playlist', async () => {
    render(reactQueryProviderHOC(<GtlPlaylist playlist={playlist} venue={venue} />))
    const scrollView = screen.getByTestId('offersModuleList')

    await act(async () => {
      // 1st scroll to last item => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    })

    expect(analytics.logAllTilesSeen).toHaveBeenNthCalledWith(1, {
      moduleId: '2xUlLBRfxdk6jeYyJszunX',
      numberOfTiles: 6,
      venueId: 5543,
    })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    })

    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
  })

  it('should log ModuleDisplayed when scrolling to the playlist', () => {
    render(reactQueryProviderHOC(<GtlPlaylist playlist={playlist} venue={venue} />))

    mockInView(true)

    expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
      displayedOn: 'venue',
      moduleId: '2xUlLBRfxdk6jeYyJszunX',
      venueId: 5543,
    })
  })

  it('should not log ModuleDisplayed when not scrolling to the playlist', () => {
    render(reactQueryProviderHOC(<GtlPlaylist playlist={playlist} venue={venue} />))

    mockInView(false)

    expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
  })
})
