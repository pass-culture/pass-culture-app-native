import omitBy from 'lodash/omitBy'

import { PageTrackingInfo } from 'store/tracking/types'

type TrackingFunction<P = unknown> = (params: P) => Promise<void>

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

export const logViewOffer = async (trackingInfo: PageTrackingInfo) => {
  if (!trackingFn) {
    throw new Error('No tracking function set')
  }
  try {
    const { playlists, pageId, pageLocation } = trackingInfo
    for (const current of playlists) {
      const { items, extra, moduleId, index } = current
      const data = {
        origin: `${pageLocation} - ${pageId}`,
        moduleId,
        index,
        ...getItemStringChunks(items.map((item) => `${item.index ?? -1}:${item.key}`)),
        ...extra,
      }

      await trackingFn(
        omitBy(data, (value) => value === undefined || value === null || value === '')
      )
    }
  } catch (err) {
    const error = err as Error
    throw new Error(error.message ?? 'Unknown error')
  }
}
