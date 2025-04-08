import { PageTrackingInfo } from 'store/tracking/types'

type TrackingFunction<P = unknown> = (params: P) => Promise<void>

let trackingFn: TrackingFunction | null = null

export const setPlaylistOfferViewTrackingFn = <P>(fn: TrackingFunction<P>) => {
  trackingFn = fn as TrackingFunction
}

export const logPlaylistOfferView = async (trackingInfo: PageTrackingInfo) => {
  if (!trackingFn) {
    throw new Error('No tracking function set')
  }
  // chain promises to send them sequentially
  try {
    const { pageId, pageLocation, playlists } = trackingInfo
    await playlists.reduce(
      (previous, current) =>
        previous.then(() => trackingFn?.({ id: pageId, location: pageLocation, ...current })),
      Promise.resolve()
    )
  } catch (err) {
    const error = err as Error
    throw new Error(error.message ?? 'Unknown error')
  }
}
