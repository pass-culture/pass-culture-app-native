import React from 'react'

import { ClippedImage } from 'ui/components/ClippedImage'

interface OnGoingTicketProps {
  image?: string
}

export function OnGoingTicket(props: OnGoingTicketProps) {
  const dPath =
    'M26.838 0c0 5.308 4.326 9.612 9.662 9.612 5.336 0 9.662-4.304 9.662-9.612H69c2.21 0 4 1.79 4 4v102c0 2.21-1.79 4-4 4l-22.838.001V110c0-5.308-4.326-9.612-9.662-9.612-5.336 0-9.662 4.304-9.662 9.612H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4h22.838z'

  return (
    <ClippedImage clipId="onGoingClip" path={dPath} width={81} height={118} image={props.image} />
  )
}
