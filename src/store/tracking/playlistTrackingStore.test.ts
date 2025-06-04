import { PageTrackingInfo, PlaylistTrackingInfo } from 'store/tracking/types'
import { act, renderHook } from 'tests/utils'

import {
  resetPageTrackingInfo,
  setPageTrackingInfo,
  setPlaylistTrackingInfo,
  useOfferPlaylistTrackingStore,
} from './playlistTrackingStore'

const PAGE_TRACKING_INFO = {
  pageId: 'abcd',
  pageLocation: 'home',
  playlists: [],
} satisfies PageTrackingInfo

describe('offerTileViewTrackingStore', () => {
  it('should return default State', () => {
    const { result } = renderHook(() => useOfferPlaylistTrackingStore())

    expect(result.current).toMatchObject({
      pageId: '',
      pageLocation: '',
      playlists: [],
    })
  })

  it('should set new page tracking info', async () => {
    const { result } = renderHook(() => useOfferPlaylistTrackingStore())

    act(() => {
      setPageTrackingInfo(PAGE_TRACKING_INFO)
    })

    expect(result.current).toMatchObject(PAGE_TRACKING_INFO)
  })

  it('should set playlist', async () => {
    const { result } = renderHook(() => useOfferPlaylistTrackingStore())

    const NEW_PLAYLIST: PlaylistTrackingInfo = {
      moduleId: 'az344',
      callId: 'sdfdkjLKJ',
      index: 1,
      items: [
        { index: 0, key: '777' },
        { index: 1, key: '999' },
      ],
      itemType: 'offer',
      viewedAt: new Date(2025, 5, 1),
    }

    act(() => {
      setPageTrackingInfo(PAGE_TRACKING_INFO)
      setPlaylistTrackingInfo(NEW_PLAYLIST)
    })

    expect(result.current.playlists).toHaveLength(1)
    expect(result.current.playlists[0]).toMatchObject(NEW_PLAYLIST)
  })

  it('should update playlist', async () => {
    const { result } = renderHook(() => useOfferPlaylistTrackingStore())

    const NEW_PLAYLIST: PlaylistTrackingInfo = {
      moduleId: 'az344',
      callId: 'sdfdkjLKJ',
      index: 1,
      items: [
        { index: 0, key: '777' },
        { index: 1, key: '999' },
      ],
      itemType: 'offer',
      viewedAt: new Date(2025, 5, 1, 10, 0),
    }

    const SECOND_PLAYLIST: PlaylistTrackingInfo = {
      moduleId: '797tyu',
      callId: 'sdfkjhOPL',
      index: 2,
      items: [
        { index: 0, key: '888' },
        { index: 1, key: '111' },
      ],
      itemType: 'offer',
      viewedAt: new Date(2025, 5, 1, 10, 2),
    }

    act(() => {
      setPageTrackingInfo(PAGE_TRACKING_INFO)
      setPlaylistTrackingInfo(NEW_PLAYLIST)
      setPlaylistTrackingInfo(SECOND_PLAYLIST)
      setPlaylistTrackingInfo({
        ...NEW_PLAYLIST,
        items: [
          { index: 0, key: '777' },
          { index: 2, key: '333' },
          { index: 3, key: '555' },
        ],
        viewedAt: new Date(2020, 2, 1),
      })
    })

    expect(result.current.playlists).toHaveLength(2)
    expect(
      result.current.playlists.find((playlist) => playlist.moduleId === NEW_PLAYLIST.moduleId)
    ).toMatchObject({
      ...NEW_PLAYLIST,
      items: [
        { index: 0, key: '777' },
        { index: 1, key: '999' },
        { index: 2, key: '333' },
        { index: 3, key: '555' },
      ],
    })
  })
})

it('should reset store to default state', async () => {
  const { result } = renderHook(() => useOfferPlaylistTrackingStore())

  act(() => {
    setPageTrackingInfo(PAGE_TRACKING_INFO)
    setPlaylistTrackingInfo({ moduleId: 'yolo' })
    resetPageTrackingInfo()
  })

  expect(result.current).toMatchObject({
    pageId: '',
    pageLocation: '',
    playlists: [],
  })
})

it('should not set playlist tracking info', async () => {
  const { result } = renderHook(() => useOfferPlaylistTrackingStore())

  act(() => {
    setPageTrackingInfo(PAGE_TRACKING_INFO)
    setPlaylistTrackingInfo({})
  })

  expect(result.current).toMatchObject(PAGE_TRACKING_INFO)
})
