import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'

// YouTube exposes the thumbnail at the original aspect ratio of the video, unlike
// hqdefault/maxresdefault which are always letterboxed to 16/9.
const getOriginalRatioThumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/oar2.jpg`

export const useVideoOrientation = (videoId?: string) => {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    if (!videoId) return

    let isSubscribed = true
    Image.getSize(
      getOriginalRatioThumbnailUrl(videoId),
      (width, height) => {
        if (isSubscribed) setIsPortrait(height > width)
      },
      () => undefined
    )

    return () => {
      isSubscribed = false
    }
  }, [videoId])

  return {
    isPortrait,
    thumbnailUrl: videoId && isPortrait ? getOriginalRatioThumbnailUrl(videoId) : undefined,
  }
}
