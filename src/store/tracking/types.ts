export type PlaylistTrackingInfo = {
  playlistId: string
  callId: string
  index: number
  offerIds: string[]
}

export type PageTrackingInfo = {
  pageLocation: string
  pageId: string
  playlists: PlaylistTrackingInfo[]
}
