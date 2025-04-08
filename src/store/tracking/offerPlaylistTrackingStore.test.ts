import { PageTrackingInfo } from 'store/tracking/types'
import { act, renderHook } from 'tests/utils'

import {
  resetPageTrackingInfo,
  setPageTrackingInfo,
  setPlaylistTrackingInfo,
  useOfferPlaylistTrackingStore,
} from './offerPlaylistTrackingStore'

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

    const NEW_PLAYLIST = {
      playlistId: 'az344',
      callId: 'sdfdkjLKJ',
      index: 1,
      offerIds: ['777', '999'],
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

    const NEW_PLAYLIST = {
      playlistId: 'az344',
      callId: 'sdfdkjLKJ',
      index: 1,
      offerIds: ['777', '999'],
    }

    const SECOND_PLAYLIST = {
      playlistId: '797tyu',
      callId: 'sdfkjhOPL',
      index: 2,
      offerIds: ['888', '111'],
    }

    act(() => {
      setPageTrackingInfo(PAGE_TRACKING_INFO)
      setPlaylistTrackingInfo(NEW_PLAYLIST)
      setPlaylistTrackingInfo(SECOND_PLAYLIST)
      setPlaylistTrackingInfo({ ...NEW_PLAYLIST, offerIds: ['777', '333', '555'] })
    })

    expect(result.current.playlists).toHaveLength(2)
    expect(
      result.current.playlists.find((playlist) => playlist.playlistId === NEW_PLAYLIST.playlistId)
    ).toMatchObject({
      ...NEW_PLAYLIST,
      offerIds: ['777', '999', '333', '555'],
    })
  })
})

it('should reset store to default state', async () => {
  const { result } = renderHook(() => useOfferPlaylistTrackingStore())

  act(() => {
    setPageTrackingInfo(PAGE_TRACKING_INFO)
    setPlaylistTrackingInfo({ playlistId: 'yolo' })
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
