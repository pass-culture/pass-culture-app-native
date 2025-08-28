export type PlaylistTrackingInfo = {
  moduleId: string
  itemType: 'offer' | 'venue' | 'artist' | 'searchResults' | 'unknown'
  callId: string
  index: number
  viewedAt: Date
  items: { key: string; index: number | null }[]
  extra?: Record<string, string | undefined>
}

export type PageTrackingInfo = {
  pageLocation: string
  pageId: string
  playlists: PlaylistTrackingInfo[]
}
