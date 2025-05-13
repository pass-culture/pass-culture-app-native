export type PlaylistTrackingInfo = {
  moduleId: string
  callId: string
  index: number
  items: { key: string; index: number | null }[]
  extra?: Record<string, string | undefined>
}

export type PageTrackingInfo = {
  pageLocation: string
  pageId: string
  playlists: PlaylistTrackingInfo[]
}
