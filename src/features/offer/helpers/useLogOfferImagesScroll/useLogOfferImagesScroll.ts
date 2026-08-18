import { useCallback, useEffect, useRef } from 'react'

import { analytics } from 'libs/analytics/provider'
import { OfferImagesScrollFrom } from 'libs/analytics/types'

type Props = {
  offerId: number
  nbImages: number
  from: OfferImagesScrollFrom
  defaultIndex?: number
}

type LogOfferImagesScroll = (imageIndex: number) => void

export const useLogOfferImagesScroll = ({
  offerId,
  nbImages,
  from,
  defaultIndex = 0,
}: Props): LogOfferImagesScroll | undefined => {
  const lastLoggedImageIndex = useRef(defaultIndex)

  useEffect(() => {
    lastLoggedImageIndex.current = defaultIndex
  }, [defaultIndex])

  const logOfferImagesScroll = useCallback(
    (imageIndex: number) => {
      if (imageIndex === lastLoggedImageIndex.current) return

      lastLoggedImageIndex.current = imageIndex
      analytics.logOfferImagesScroll({ offerId, nbImages, imageIndex, from })
    },
    [offerId, nbImages, from]
  )

  return nbImages > 1 ? logOfferImagesScroll : undefined
}
