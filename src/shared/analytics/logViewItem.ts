import omitBy from 'lodash/omitBy'

import { TrackingLogger } from 'shared/tracking/TrackingLogger'
import { PageTrackingInfo } from 'shared/tracking/TrackingManager'
// Import the new unified logging system

type TrackingFunction<P = unknown> = (params: P) => Promise<void>

// Use the new unified logging system instead of console.log
// No more feature flag needed, handled globally by TrackingLogger
export const logPlaylistDebug = (component: string, message: string, data?: unknown) => {
  // Convert old logs to the new system
  TrackingLogger.debug(`LEGACY_${component}`, {
    message,
    ...(data as Record<string, unknown>),
  })
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
    TrackingLogger.error('ANALYTICS_NO_TRACKING_FN', {
      error: 'No tracking function set',
    })
    throw new Error('No tracking function set')
  }

  // Skip if no playlists
  if (!trackingInfo?.playlists?.length) {
    TrackingLogger.debug('ANALYTICS_NO_DATA', {
      pageLocation: trackingInfo?.pageLocation,
      pageId: trackingInfo?.pageId,
    })
    return
  }

  TrackingLogger.info('ANALYTICS_SEND_START', {
    pageLocation: trackingInfo.pageLocation,
    playlistsCount: trackingInfo.playlists.length,
    pageId: trackingInfo.pageId,
  })

  try {
    const { playlists, pageLocation } = trackingInfo
    for (const current of playlists) {
      const { items, extra, moduleId, index, viewedAt, itemType, callId, artistId, searchId } =
        current
      const data = {
        origin: pageLocation.toLowerCase(),
        viewedAt: viewedAt.toISOString(),
        moduleId,
        itemType,
        index,
        callId,
        artistId,
        searchId,
        ...getItemStringChunks(items.map((item) => `${item.index ?? -1}:${item.key}`)),
        ...extra,
      }

      TrackingLogger.debug('ANALYTICS_MODULE_SEND', {
        moduleId,
        itemType,
        itemsCount: items.length,
        hasCallId: !!callId,
        hasArtistId: !!artistId,
      })

      await trackingFn(
        omitBy(data, (value) => value === undefined || value === null || value === '')
      )

      TrackingLogger.debug('ANALYTICS_MODULE_SENT', { moduleId })
    }

    TrackingLogger.info('ANALYTICS_SEND_SUCCESS', {
      totalPlaylists: playlists.length,
      pageLocation: trackingInfo.pageLocation,
      pageId: trackingInfo.pageId,
    })
  } catch (err) {
    const error = err as Error
    TrackingLogger.error('ANALYTICS_SEND_ERROR', {
      error: error.message,
      pageLocation: trackingInfo?.pageLocation,
    })
    throw error
  }
}
