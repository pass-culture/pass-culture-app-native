import { useContext } from 'react'

import { EventBusContext } from './EventBusContext'

export const useEventBus = () => useContext(EventBusContext)
