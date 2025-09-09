import uniqBy from 'lodash/uniqBy'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { PageTrackingInfo, PlaylistTrackingInfo } from 'store/tracking/types'

const DEFAULT_STATE = {
  pageId: '',
  pageLocation: '',
  playlists: [],
}

const updatePlaylistInfo = (
  playlist: PlaylistTrackingInfo,
  data: Partial<PlaylistTrackingInfo>
): PlaylistTrackingInfo => {
  return {
    ...playlist,
    items: uniqBy([...playlist.items, ...(data.items ?? [])], 'key'),
    callId: data.callId ?? playlist.callId,
    index: data.index === undefined || data.index === -1 ? playlist.index : data.index,
    extra: data.extra ?? playlist.extra,
    artistId: data.artistId,
  }
}

export const useOfferPlaylistTrackingStore = create<PageTrackingInfo>()(() => DEFAULT_STATE)

// Set page information
export const setPageTrackingInfo = ({
  pageId,
  pageLocation,
}: Omit<PageTrackingInfo, 'playlists'>) =>
  useOfferPlaylistTrackingStore.setState({ pageId, pageLocation })

// Set playlist informations
export const setPlaylistTrackingInfo = ({
  moduleId,
  itemType = 'unknown',
  viewedAt = new Date(),
  callId = '',
  items = [],
  index = -1,
  extra = {},
  artistId,
}: Partial<PlaylistTrackingInfo>) => {
  if (!moduleId) {
    return
  }

  const state = useOfferPlaylistTrackingStore.getState()

  const playlist = state.playlists.find((item) => item.moduleId === moduleId) ?? {
    moduleId,
    itemType,
    viewedAt,
    callId,
    items,
    index,
    extra,
  }
  const updatedPlaylist = updatePlaylistInfo(playlist, { callId, items, index, extra, artistId })

  const playlists = [
    ...state.playlists.filter((item) => item.moduleId !== playlist.moduleId),
    updatedPlaylist,
  ]

  useOfferPlaylistTrackingStore.setState({ playlists })
}

// Reset store to default state
export const resetPageTrackingInfo = () => {
  useOfferPlaylistTrackingStore.setState(DEFAULT_STATE)
}
