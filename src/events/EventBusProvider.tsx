import React, { PropsWithChildren } from 'react'

import { eventBus } from './eventBus'
import { EventBusContext } from './EventBusContext'

export const EventBusProvider = ({ children }: PropsWithChildren) => {
  return <EventBusContext.Provider value={eventBus}>{children}</EventBusContext.Provider>
}
