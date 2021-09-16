import React, { memo, FC, useMemo } from 'react'

import { ClippedImage, ClippedImageProps } from 'ui/components/ClippedImage'
import { IconInterface } from 'ui/svg/icons/types'

interface OnGoingTicketProps {
  image?: string
  altIcon: FC<IconInterface>
}

export const OnGoingTicket = memo(function OnGoingTicket(props: OnGoingTicketProps) {
  const clippedImageProps = useClippedImageProps(props.altIcon, props.image)
  return <ClippedImage {...clippedImageProps} />
})

const onGoingTicketPath =
  'M26.838 0c0 5.308 4.326 9.612 9.662 9.612 5.336 0 9.662-4.304 9.662-9.612H69c2.21 0 4 1.79 4 4v102c0 2.21-1.79 4-4 4l-22.838.001V110c0-5.308-4.326-9.612-9.662-9.612-5.336 0-9.662 4.304-9.662 9.612H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4h22.838z'

const useClippedImageProps = (altIcon: FC<IconInterface>, image?: string): ClippedImageProps => {
  const props = {
    clipId: 'onGoingClip',
    path: onGoingTicketPath,
    width: 73,
    height: 110,
  }
  return useMemo(() => Object.assign(props, image ? { image } : { altIcon }), [altIcon, image])
}
