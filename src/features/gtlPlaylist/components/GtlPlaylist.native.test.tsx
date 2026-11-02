import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')

const venue: VenueResponse = venueDataTest

const playlist = gtlPlaylistAlgoliaSnapshot[0] as GtlPlaylistData

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

let observerCallback: IntersectionObserverCallback | undefined

const emitInView = (isIntersecting: boolean) => {
  act(() => {
    jest.advanceTimersByTime(300)
  })
  act(() => {
    observerCallback?.(
      [
        {
          isIntersecting,
          boundingClientRect: { height: 100 },
          intersectionRect: { height: 100 },
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )
  })
}

jest.useFakeTimers()

afterAll(() => {
  jest.useRealTimers()
})

const user = userEvent.setup()

describe('GtlPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags()
    observerCallback = undefined
    globalThis.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: () => [],
      }
    }) as unknown as typeof globalThis.IntersectionObserver
  })

  describe('on venue page', () => {
    it('should log ConsultOffer when pressing an item', async () => {
      renderGtlPlaylistOnVenuePage()

      const item = await screen.findByText('Mon abonnement bibliothèque')

      await user.press(item)

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          from: 'venue',
          index: 0,
          moduleId: '2xUlLBRfxdk6jeYyJszunX',
          offerId: '12',
          venueId: 5543,
          isHeadline: false,
        })
      )
    })

    // TODO(PC-35728): fix broken test
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should log AllTilesSeen only once when scrolling to the end of the playlist', async () => {
      renderGtlPlaylistOnVenuePage()
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

    it('should log ModuleDisplayed when scrolling to the playlist', async () => {
      renderGtlPlaylistOnVenuePage()

      await screen.findByText('Mon abonnement bibliothèque')

      emitInView(true)

      expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
        displayedOn: 'venue',
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
        venueId: 5543,
      })
    })

    it('should not log ModuleDisplayed when not scrolling to the playlist', async () => {
      renderGtlPlaylistOnVenuePage()

      await screen.findByText('Mon abonnement bibliothèque')

      emitInView(false)

      expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
    })
  })

  describe('on ThematicSearch page', () => {
    it('should log ConsultOffer when pressing an item', async () => {
      renderGtlPlaylistOnThematicSearch()

      const item = await screen.findByText('Mon abonnement bibliothèque')

      await user.press(item)

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          from: 'thematicsearch',
          index: 0,
          moduleId: '2xUlLBRfxdk6jeYyJszunX',
          offerId: '12',
          venueId: 5543,
        })
      )
    })

    // TODO(PC-35728): fix broken test
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should log AllTilesSeen only once when scrolling to the end of the playlist', async () => {
      renderGtlPlaylistOnThematicSearch()
      const scrollView = screen.getByTestId('offersModuleList')

      await act(async () => {
        // 1st scroll to last item => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenNthCalledWith(1, {
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
        numberOfTiles: 6,
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
    })

    it('should log ModuleDisplayed when scrolling to the playlist', async () => {
      renderGtlPlaylistOnThematicSearch()

      await screen.findByText('Mon abonnement bibliothèque')

      emitInView(true)

      expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
        displayedOn: 'thematicsearch',
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
      })
    })

    it('should not log ModuleDisplayed when not scrolling to the playlist', async () => {
      renderGtlPlaylistOnVenuePage()

      await screen.findByText('Mon abonnement bibliothèque')

      emitInView(false)

      expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
    })
  })
})

function renderGtlPlaylist(
  gtlPlaylist: GtlPlaylistData,
  analyticsFrom: Referrals,
  route: Extract<ScreenNames, 'Venue' | 'ThematicSearch'>,
  venue?: VenueResponse
) {
  return render(
    reactQueryProviderHOC(
      <GtlPlaylist
        playlist={gtlPlaylist}
        venue={venue}
        analyticsFrom={analyticsFrom}
        route={route}
      />
    )
  )
}

const renderGtlPlaylistOnVenuePage = () => renderGtlPlaylist(playlist, 'venue', 'Venue', venue)

const renderGtlPlaylistOnThematicSearch = () =>
  renderGtlPlaylist(playlist, 'thematicsearch', 'ThematicSearch')
