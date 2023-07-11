import React, { useEffect, useReducer, useContext } from 'react'

import { register, unregister } from './serviceWorkerRegistration'

const SERVICE_WORKER_READY = 'SERVICE_WORKER_READY'
const SERVICE_WORKER_REGISTERED = 'SERVICE_WORKER_REGISTERED'
const SERVICE_WORKER_CACHED = 'SERVICE_WORKER_CACHED'
const SERVICE_WORKER_UPDATE_FOUND = 'SERVICE_WORKER_UPDATE_FOUND'
const SERVICE_WORKER_OFFLINE = 'SERVICE_WORKER_OFFLINE'
const SERVICE_WORKER_UPDATE_READY = 'SERVICE_WORKER_UPDATE_READY'
const SERVICE_WORKER_ERROR = 'SERVICE_WORKER_ERROR'
const TIME_TO_WAIT_FOR_SW_UPDATE_IN_MS = 5000

interface ServiceWorkerReady {
  type: typeof SERVICE_WORKER_READY
  payload: ServiceWorker
}

interface ServiceWorkerRegistered {
  type: typeof SERVICE_WORKER_REGISTERED
  payload: ServiceWorker
}

interface ServiceWorkerCached {
  type: typeof SERVICE_WORKER_CACHED
  payload: ServiceWorker
}

interface ServiceWorkerUpdateFound {
  type: typeof SERVICE_WORKER_UPDATE_FOUND
  payload: ServiceWorker
}

interface ServiceWorkerOffline {
  type: typeof SERVICE_WORKER_OFFLINE
  payload: ServiceWorker
}

interface ServiceWorkerUpdateReady {
  type: typeof SERVICE_WORKER_UPDATE_READY
  payload: ServiceWorker
}

interface ServiceWorkerError {
  type: typeof SERVICE_WORKER_ERROR
  payload: ServiceWorker
}

type ServiceWorkerActionTypes =
  | ServiceWorkerReady
  | ServiceWorkerRegistered
  | ServiceWorkerCached
  | ServiceWorkerUpdateFound
  | ServiceWorkerOffline
  | ServiceWorkerUpdateReady
  | ServiceWorkerError

type ServiceWorkerStatus =
  | 'offline'
  | 'registered'
  | 'register'
  | 'ready'
  | 'cached'
  | 'updates'
  | 'updated'
  | 'error'

interface ServiceWorker {
  serviceWorkerStatus: ServiceWorkerStatus
  registration?: null | ServiceWorkerRegistration
  error?: Error
}

interface ServiceWorkerState {
  serviceWorkerStatus: ServiceWorkerStatus
  registration?: null | ServiceWorkerRegistration
  error?: Error
}

const useServiceWorkerReducer = (
  state: ServiceWorkerState,
  action: ServiceWorkerActionTypes
): ServiceWorkerState => {
  switch (action.type) {
    case 'SERVICE_WORKER_READY':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_REGISTERED':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_CACHED':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_UPDATE_FOUND':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_UPDATE_READY':
      globalThis.window.pcupdate = true
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_OFFLINE':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
      }
    case 'SERVICE_WORKER_ERROR':
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
      }

    default:
      return state
  }
}

const initialState: ServiceWorkerState = {
  registration: null,
  serviceWorkerStatus: 'register',
}
const serviceWorkerContext = React.createContext(initialState)

export function ServiceWorkerProvider({
  children,
  fileName,
  registrationOptions,
}: {
  children: React.ReactNode
  fileName: string
  registrationOptions?: RegistrationOptions
}) {
  const serviceWorker = useProvideServiceWorker(fileName, registrationOptions)
  return (
    <serviceWorkerContext.Provider value={serviceWorker}>{children}</serviceWorkerContext.Provider>
  )
}

export const useServiceWorker = () => {
  return useContext(serviceWorkerContext)
}

const useProvideServiceWorker = (
  file = 'service-worker.js',
  registrationOptions: RegistrationOptions = {}
) => {
  const [swState, dispatch] = useReducer(useServiceWorkerReducer, initialState)
  useEffect(() => {
    // Update and install new service worker before deleting it
    register(file, {
      registrationOptions,
      ready(registration: ServiceWorkerRegistration) {
        dispatch({
          type: 'SERVICE_WORKER_READY',
          payload: { serviceWorkerStatus: 'ready', registration },
        })
      },
      registered(registration: ServiceWorkerRegistration) {
        dispatch({
          type: 'SERVICE_WORKER_REGISTERED',
          payload: { serviceWorkerStatus: 'registered', registration },
        })
      },
      cached(registration: ServiceWorkerRegistration) {
        dispatch({
          type: 'SERVICE_WORKER_REGISTERED',
          payload: { serviceWorkerStatus: 'cached', registration },
        })
      },
      updatefound(registration: ServiceWorkerRegistration) {
        dispatch({
          type: 'SERVICE_WORKER_UPDATE_FOUND',
          payload: { serviceWorkerStatus: 'updates', registration },
        })
      },
      updated(registration: ServiceWorkerRegistration) {
        dispatch({
          type: 'SERVICE_WORKER_UPDATE_READY',
          payload: { serviceWorkerStatus: 'updated', registration },
        })
      },
      offline() {
        dispatch({
          type: 'SERVICE_WORKER_OFFLINE',
          payload: { serviceWorkerStatus: 'offline' },
        })
      },
      error(error: Error) {
        dispatch({
          type: 'SERVICE_WORKER_OFFLINE',
          payload: { serviceWorkerStatus: 'error', error },
        })
      },
    })

    // Delete service worker
    const timer = globalThis.setTimeout(() => {
      unregister()
      window.location.reload()
    }, TIME_TO_WAIT_FOR_SW_UPDATE_IN_MS)

    return () => {
      globalThis.clearTimeout(timer)
      unregister()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return swState
}
