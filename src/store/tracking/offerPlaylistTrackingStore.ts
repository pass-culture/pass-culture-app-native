// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { PageTrackingInfo, PlaylistTrackingInfo } from 'store/tracking/types'

const mergeUniqueValues = (source: string[], target: string[]) =>
  Array.from(new Set([...source, ...target]))

const DEFAULT_STATE = {
  pageId: '',
  pageLocation: '',
  playlists: [],
}

const updatePlaylistInfo = (
  playlist: PlaylistTrackingInfo,
  data: Partial<PlaylistTrackingInfo>
) => {
  return {
    ...playlist,
    offerIds: mergeUniqueValues(playlist.offerIds, data?.offerIds ?? []),
    callId: data.callId ?? playlist.callId,
    index: data.index === undefined || data.index === -1 ? playlist.index : data.index,
  }
}

export const useOfferPlaylistTrackingStore = create<PageTrackingInfo>()(() => DEFAULT_STATE)

// Set page information
export const setPageTrackingInfo = ({ pageId, pageLocation, playlists = [] }: PageTrackingInfo) =>
  useOfferPlaylistTrackingStore.setState({ pageId, pageLocation, playlists })

// Set playlist informations
export const setPlaylistTrackingInfo = ({
  playlistId,
  callId = '',
  offerIds = [],
  index = -1,
}: Partial<PlaylistTrackingInfo>) => {
  if (!playlistId) {
    return
  }

  const state = useOfferPlaylistTrackingStore.getState()

  const playlist = state.playlists.find((item) => item.playlistId === playlistId) ?? {
    playlistId,
    callId,
    offerIds,
    index,
  }
  const updatedPlaylist = updatePlaylistInfo(playlist, { callId, offerIds, index })

  const playlists = [
    ...state.playlists.filter((item) => item.playlistId !== playlist.playlistId),
    updatedPlaylist,
  ]

  useOfferPlaylistTrackingStore.setState({ playlists })
}

// Reset store to default state
export const resetPageTrackingInfo = () => {
  useOfferPlaylistTrackingStore.setState(DEFAULT_STATE)
}
