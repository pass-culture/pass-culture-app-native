import React from 'react'

import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

const DEFAULT_PLAYLIST_OFFERS = mockBuilder.searchResponseOffer({})
const DEFAULT_PLAYLIST_ID = 'cinema_films_a_l_affiche'
const DEFAULT_PLAYLIST_TITLE = 'Titre de la playlist'
const DEFAULT_PLAYLIST = {
  id: DEFAULT_PLAYLIST_ID,
  title: DEFAULT_PLAYLIST_TITLE,
  offers: DEFAULT_PLAYLIST_OFFERS,
}
const SEARCH_ID = 'searchId'

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

describe('ThematicSearchPlaylist', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_INTERSECTION_OBSERVER])
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

  it('should log ConsultOffer with playlist id as moduleId when pressing an item', async () => {
    renderThematicSearchPlaylist(DEFAULT_PLAYLIST, 'thematicsearch', 'ThematicSearch')

    const offer = await screen.findByText('Harry potter à l’école des sorciers')

    await userEvent.setup().press(offer)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'thematicsearch',
      index: 0,
      offerId: '1',
      isHeadline: false,
      moduleId: DEFAULT_PLAYLIST_ID,
    })
  })

  it('should log ModuleDisplayed when scrolling to the playlist', async () => {
    renderThematicSearchPlaylist(DEFAULT_PLAYLIST, 'thematicsearch', 'ThematicSearch', SEARCH_ID)

    await screen.findByText('Harry potter à l’école des sorciers')

    emitInView(true)

    expect(analytics.logModuleDisplayed).toHaveBeenNthCalledWith(1, {
      moduleId: DEFAULT_PLAYLIST_ID,
      displayedOn: 'thematicsearch',
      searchId: SEARCH_ID,
    })
  })

  it('should log ModuleDisplayed only once when scrolling several times to the playlist', async () => {
    renderThematicSearchPlaylist(DEFAULT_PLAYLIST, 'thematicsearch', 'ThematicSearch', SEARCH_ID)

    await screen.findByText('Harry potter à l’école des sorciers')

    emitInView(true)
    emitInView(false)
    emitInView(true)

    expect(analytics.logModuleDisplayed).toHaveBeenCalledTimes(1)
  })

  it('should not log ModuleDisplayed when not scrolling to the playlist', async () => {
    renderThematicSearchPlaylist(DEFAULT_PLAYLIST, 'thematicsearch', 'ThematicSearch', SEARCH_ID)

    await screen.findByText('Harry potter à l’école des sorciers')

    emitInView(false)

    expect(analytics.logModuleDisplayed).not.toHaveBeenCalled()
  })
})

function renderThematicSearchPlaylist(
  cinemaPlaylist: ThematicSearchPlaylistData,
  analyticsFrom: Referrals,
  route: Extract<ScreenNames, 'ThematicSearch'>,
  searchId?: string
) {
  return render(
    reactQueryProviderHOC(
      <ThematicSearchPlaylist
        playlist={cinemaPlaylist}
        analyticsFrom={analyticsFrom}
        route={route}
        searchId={searchId}
      />
    )
  )
}
