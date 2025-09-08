import omitBy from 'lodash/omitBy'

import { PageTrackingInfo } from 'store/tracking/types'

type TrackingFunction<P = unknown> = (params: P) => Promise<void>

// Feature flag pour les logs de debug du tracking des playlists
// Mettre \u00e0 true pour activer tous les logs de debug, false pour d\u00e9sactiver
const DEBUG_PLAYLIST_TRACKING = false

export const logPlaylistDebug = (component: string, message: string, data?: unknown) => {
  if (DEBUG_PLAYLIST_TRACKING) {
    // eslint-disable-next-line no-console
    console.log(`[${component}] ${message}`, data)
  }
}

let trackingFn: TrackingFunction | null = null

const getItemStringChunks = (
  items: string[],
  maxChars = 100
): Record<`items_${number}`, string> => {
  const output = {}
  let tmpString = ''

  items.forEach((item) => {
    if (tmpString.concat(item).length + (tmpString.length === 0 ? 0 : 1) > maxChars) {
      const currentIndex = Object.keys(output).length
      output[`items_${currentIndex}`] = tmpString

      tmpString = item
    } else {
      tmpString += `${tmpString.length === 0 ? '' : ','}${item}`
    }
  })

  if (tmpString) {
    const currentIndex = Object.keys(output).length
    output[`items_${currentIndex}`] = tmpString
  }

  return output
}

export const setViewOfferTrackingFn = <P>(fn: TrackingFunction<P>) => {
  trackingFn = fn as TrackingFunction
}

export const logViewItem = async (trackingInfo: PageTrackingInfo) => {
  if (!trackingFn) {
    logPlaylistDebug('PLAYLIST_TRACKING', 'ERROR: No tracking function set')
    throw new Error('No tracking function set')
  }

  logPlaylistDebug('PLAYLIST_TRACKING', 'Starting logViewItem', {
    pageLocation: trackingInfo.pageLocation,
    playlistsCount: trackingInfo.playlists.length,
  })

  try {
    const { playlists, pageLocation } = trackingInfo
    for (const current of playlists) {
      const { items, extra, moduleId, index, viewedAt, itemType } = current
      const data = {
        origin: pageLocation.toLowerCase(),
        viewedAt: viewedAt.toISOString(),
        moduleId,
        itemType,
        index,
        ...getItemStringChunks(items.map((item) => `${item.index ?? -1}:${item.key}`)),
        ...extra,
      }

      logPlaylistDebug('PLAYLIST_TRACKING', `Sending stats for module ${moduleId}`, {
        moduleId,
        itemType,
        index,
        itemsCount: items.length,
        origin: data.origin,
        viewedAt: data.viewedAt,
        itemKeys: items.map((item) => `${item.index ?? -1}:${item.key}`),
      })

      await trackingFn(
        omitBy(data, (value) => value === undefined || value === null || value === '')
      )

      logPlaylistDebug('PLAYLIST_TRACKING', `Successfully sent stats for module ${moduleId}`)
    }

    logPlaylistDebug('PLAYLIST_TRACKING', 'All playlist stats sent successfully', {
      totalPlaylists: playlists.length,
    })
  } catch (err) {
    const error = err as Error
    logPlaylistDebug('PLAYLIST_TRACKING', 'ERROR sending playlist stats', {
      error: error.message,
    })
    throw new Error(error.message ?? 'Unknown error')
  }
}
