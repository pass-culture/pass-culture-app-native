import React from 'react'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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
const DEFAULT_PLAYLIST_OFFERS = mockBuilder.searchResponseOffer({})
const DEFAULT_PLAYLIST_TITLE = 'Titre de la playlist'
const DEFAULT_PLAYLIST = { title: DEFAULT_PLAYLIST_TITLE, offers: DEFAULT_PLAYLIST_OFFERS }

jest.useFakeTimers()

describe('ThematicSearchPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should log ConsultOffer when pressing an item', async () => {
    renderThematicSearchPlaylist(DEFAULT_PLAYLIST, 'thematicsearch', 'ThematicSearch')

    const offer = await screen.findByText('Harry potter à l’école des sorciers')

    await userEvent.setup().press(offer)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'thematicsearch',
      index: 0,
      offerId: 1,
    })
  })
})

function renderThematicSearchPlaylist(
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
