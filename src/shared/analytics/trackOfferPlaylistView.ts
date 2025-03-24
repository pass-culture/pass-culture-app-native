import { PageTrackingInfo } from 'store/tracking/types'

type TrackingFunction<P = unknown> = (params: P) => Promise<void>

let trackingFn: TrackingFunction | null = null

export const setOfferPlaylistViewTrackingFn = <P>(fn: TrackingFunction<P>) => {
  trackingFn = fn as TrackingFunction
}

export const trackOfferPlaylistView = async (trackingInfo: PageTrackingInfo) => {
  const tracking = trackingFn

  if (!tracking) {
    throw new Error('Tracking function is not set.')
  }

  // Get state from store
  const { pageId, pageLocation, playlists } = trackingInfo
  // chain promises to send them sequentially
  try {
    await playlists.reduce(
      (previous, current) =>
        previous.then(() => {
          tracking({ id: pageId, location: pageLocation, ...current })
        }),
      Promise.resolve()
    )
  } catch (err) {
    console.error(err)
  }
}
