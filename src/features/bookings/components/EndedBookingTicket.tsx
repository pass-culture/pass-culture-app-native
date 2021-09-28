import React, { memo, useMemo } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { ClippedImage, ClippedImageProps } from 'ui/components/ClippedImage'

interface EndedBookingTicketProps {
  image?: string
  categoryId?: CategoryIdEnum | null
}

export const EndedBookingTicket = memo(function EndedBookingTicket(props: EndedBookingTicketProps) {
  const clippedImageProps = useClippedImageProps(props.image, props.categoryId)
  return <ClippedImage {...clippedImageProps} />
})

const usedTicketPath =
  'M20 0c0 4.97 4.03 9 9 9s9-4.03 9-9h16c2.21 0 4 1.79 4 4v59c0 1.865-1.277 3.433-3.004 3.875L55 67c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2H7c0-1.105-.895-2-2-2-1.062 0-1.931.828-1.996 1.874C1.277 66.433 0 64.865 0 63V4c0-2.21 1.79-4 4-4h16z'

const useClippedImageProps = (
  image?: string,
  categoryId?: CategoryIdEnum | null
): ClippedImageProps => {
  return useMemo(() => {
    return Object.assign(
      {
        clipId: 'onGoingClip',
        path: usedTicketPath,
        width: 58,
        height: 67,
      },
      image ? { image } : { altIcon: mapCategoryToIcon(categoryId ?? null) }
    )
  }, [image, categoryId])
}
