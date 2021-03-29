import React from 'react'

import { CategoryNameEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { ClippedImage, ClippedImageProps } from 'ui/components/ClippedImage'

interface EndedBookingTicketProps {
  image?: string
  offerCategory?: CategoryNameEnum | null
}

/**
 * use of a PureComponent prevents useless re-rendering while the props remain unchanged
 */
export class EndedBookingTicket extends React.PureComponent<EndedBookingTicketProps> {
  constructor(props: EndedBookingTicketProps) {
    super(props)
  }

  render() {
    return <ClippedImage {...getClippedImageProps(this.props.image, this.props.offerCategory)} />
  }
}

export const endedBookingTicketWidth = 58

const usedTicketPath =
  'M20 0c0 4.97 4.03 9 9 9s9-4.03 9-9h16c2.21 0 4 1.79 4 4v59c0 1.865-1.277 3.433-3.004 3.875L55 67c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2h-4c0-1.105-.895-2-2-2s-2 .895-2 2H7c0-1.105-.895-2-2-2-1.062 0-1.931.828-1.996 1.874C1.277 66.433 0 64.865 0 63V4c0-2.21 1.79-4 4-4h16z'

const getClippedImageProps = (
  image?: string,
  offerCategory?: CategoryNameEnum | null
): ClippedImageProps =>
  Object.assign(
    {
      clipId: 'onGoingClip',
      path: usedTicketPath,
      width: endedBookingTicketWidth,
      height: 67,
    },
    image ? { image } : { altIcon: mapCategoryToIcon(offerCategory ?? null) }
  )
