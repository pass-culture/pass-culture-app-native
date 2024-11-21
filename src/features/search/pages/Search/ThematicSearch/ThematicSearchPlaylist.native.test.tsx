import React from 'react'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { defaultCinemaPlaylistOffer } from 'features/search/pages/Search/ThematicSearch/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import { ThematicSearchPlaylist } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchPlaylistData } from 'features/search/pages/Search/ThematicSearch/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx

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

const playlist = defaultCinemaPlaylistOffer

describe('ThematicSearchPlaylist', () => {
  it('should log ConsultOffer when pressing an item', async () => {
    renderCinemaPlaylist(playlist, 'thematicsearch', 'ThematicSearch')

    const offer = await screen.findByText('Harry potter à l’école des sorciers')

    await act(async () => {
      fireEvent.press(offer)
    })

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'thematicsearch',
      index: 0,
      offerId: 1,
    })
  })
})

function renderCinemaPlaylist(
  cinemaPlaylist: ThematicSearchPlaylistData,
  analyticsFrom: Referrals,
  route: Extract<ScreenNames, 'ThematicSearch'>
) {
  return render(
    reactQueryProviderHOC(
      <ThematicSearchPlaylist
        playlist={cinemaPlaylist}
        analyticsFrom={analyticsFrom}
        route={route}
      />
    )
  )
}
