import React from 'react'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { CinemaPlaylistData } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { CinemaPlaylist } from 'features/search/pages/Search/ThematicSearch/Cinema/CinemaPlaylist'
import { cinemaPlaylistAlgoliaSnapshot } from 'features/search/pages/Search/ThematicSearch/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

const playlist = cinemaPlaylistAlgoliaSnapshot[0] as CinemaPlaylistData

describe('CinemaPlaylist', () => {
  describe('on ThematicSearch page', () => {
    it('should log ConsultOffer when pressing an item', async () => {
      renderCinemaPlaylist(playlist, 'thematicsearch', 'ThematicSearch')

      const offer = await screen.findByText('Harry potter à l’école des sorciers')

      fireEvent.press(offer)

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        from: 'thematicsearch',
        index: 0,
        offerId: 1,
      })
    })
  })
})

function renderCinemaPlaylist(
  cinemaPlaylist: CinemaPlaylistData,
  analyticsFrom: Referrals,
  route: Extract<ScreenNames, 'ThematicSearch'>
) {
  return render(
    reactQueryProviderHOC(
      <CinemaPlaylist playlist={cinemaPlaylist} analyticsFrom={analyticsFrom} route={route} />
    )
  )
}
