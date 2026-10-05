import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'

// YouTube exposes the thumbnail at the original aspect ratio of the video, unlike
// hqdefault/maxresdefault which are always letterboxed to 16/9.
const getOriginalRatioThumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/oar2.jpg`

export const videoOrientationCache = new Map<string, boolean>()

type MeasuredOrientation = {
  videoId: string
  isPortrait: boolean
}

const getOrientation = (videoId?: string, measured?: MeasuredOrientation) => {
  if (!videoId) return false
  if (measured?.videoId === videoId) return measured.isPortrait

  return videoOrientationCache.get(videoId) ?? false
}

export const useVideoOrientation = (videoId?: string) => {
  const [measured, setMeasured] = useState<MeasuredOrientation>()

  useEffect(() => {
    if (!videoId || videoOrientationCache.has(videoId)) return

    let isSubscribed = true
    Image.getSize(
      getOriginalRatioThumbnailUrl(videoId),
      (width, height) => {
        const isPortrait = height > width
        videoOrientationCache.set(videoId, isPortrait)
        if (isSubscribed) setMeasured({ videoId, isPortrait })
      },
      () => {
        if (isSubscribed) setMeasured({ videoId, isPortrait: false })
      }
    )

    return () => {
      isSubscribed = false
    }
  }, [videoId])

  const isPortrait = getOrientation(videoId, measured)

  return {
    isPortrait,
    thumbnailUrl: videoId && isPortrait ? getOriginalRatioThumbnailUrl(videoId) : undefined,
  }
}
