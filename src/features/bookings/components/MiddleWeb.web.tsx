import React from 'react'

import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft.web'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight.web'

export const MiddleWeb = ({ children }: { children: React.JSX.Element }) => (
  <React.Fragment>
    <TicketCutoutLeft />
    {children}
    <TicketCutoutRight />
  </React.Fragment>
)
