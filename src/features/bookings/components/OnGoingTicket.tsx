import React from 'react'

import { ClippedImage, ClippedImageProps } from 'ui/components/ClippedImage'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'

interface OnGoingTicketProps {
  image?: string
}

/**
 * use of a PureComponent prevents useless re-rendering while the props remain unchanged
 */
export class OnGoingTicket extends React.PureComponent<OnGoingTicketProps> {
  constructor(props: OnGoingTicketProps) {
    super(props)
  }

  render() {
    return <ClippedImage {...getClippedImageProps(this.props.image)} />
  }
}

export const onGoingTicketWidth = 81

const onGoingTicketPath =
  'M26.838 0c0 5.308 4.326 9.612 9.662 9.612 5.336 0 9.662-4.304 9.662-9.612H69c2.21 0 4 1.79 4 4v102c0 2.21-1.79 4-4 4l-22.838.001V110c0-5.308-4.326-9.612-9.662-9.612-5.336 0-9.662 4.304-9.662 9.612H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4h22.838z'

const getClippedImageProps = (image?: string): ClippedImageProps =>
  Object.assign(
    {
      clipId: 'onGoingClip',
      path: onGoingTicketPath,
      width: onGoingTicketWidth,
      height: 118,
    },
    image ? { image } : { altIcon: OfferDigital }
  )
