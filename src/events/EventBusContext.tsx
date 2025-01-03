import EventEmitter from 'eventemitter3'
import React from 'react'

export const EventBusContext = React.createContext<EventEmitter>(new EventEmitter())
