import React from 'react'

import { TicketCutoutLeft } from 'ui/svg/TicketCutoutLeft'
import { TicketCutoutRight } from 'ui/svg/TicketCutoutRight'

export const Middle = ({ children }: { children: React.JSX.Element }) => (
  <React.Fragment>
    <TicketCutoutLeft />
    {children}
    <TicketCutoutRight />
  </React.Fragment>
)
