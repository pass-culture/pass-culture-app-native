import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { InViewProps } from 'react-native-intersection-observer'

import { VenueResponse } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

const venue: VenueResponse = venueDataTest

const playlist = gtlPlaylistAlgoliaSnapshot[0] as GtlPlaylistData

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

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('GtlPlaylist', () => {
  describe('on venue page', () => {
    it('should log ConsultOffer when pressing an item', () => {
      renderGtlPlaylistOnVenuePage()

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

    it('should log ModuleDisplayed when scrolling to the playlist', () => {
      renderGtlPlaylistOnVenuePage()

      mockInView(true)

      expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
        displayedOn: 'venue',
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
        venueId: 5543,
      })
    })

    it('should not log ModuleDisplayed when not scrolling to the playlist', () => {
      renderGtlPlaylistOnVenuePage()

      mockInView(false)

      expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
    })
  })

  describe('on searchN1 page', () => {
    it('should log ConsultOffer when pressing an item', () => {
      renderGtlPlaylistOnSearchN1Page()

      const result = screen.queryAllByText('Mon abonnement bibliothèque')[0]

      if (result) {
        fireEvent.press(result)
      }

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        from: 'searchn1',
        index: 0,
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
        offerId: 12,
      })
    })

    it('should log AllTilesSeen only once when scrolling to the end of the playlist', async () => {
      renderGtlPlaylistOnSearchN1Page()
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

    it('should log ModuleDisplayed when scrolling to the playlist', () => {
      renderGtlPlaylistOnSearchN1Page()

      mockInView(true)

      expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
        displayedOn: 'searchn1',
        moduleId: '2xUlLBRfxdk6jeYyJszunX',
      })
    })

    it('should not log ModuleDisplayed when not scrolling to the playlist', () => {
      renderGtlPlaylistOnVenuePage()

      mockInView(false)

      expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
    })
  })
})

function renderGtlPlaylist(
  gtlPlaylist: GtlPlaylistData,
  analyticsFrom: Referrals,
  route: Extract<ScreenNames, 'Venue' | 'SearchN1'>,
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

const renderGtlPlaylistOnSearchN1Page = () => renderGtlPlaylist(playlist, 'searchn1', 'SearchN1')
