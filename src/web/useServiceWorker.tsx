import React, { useEffect, useReducer, useContext } from 'react'

import { register, unregister } from './serviceWorkerRegistration'

const SERVICE_WORKER_READY = 'SERVICE_WORKER_READY'
const SERVICE_WORKER_REGISTERED = 'SERVICE_WORKER_REGISTERED'
const SERVICE_WORKER_CACHED = 'SERVICE_WORKER_CACHED'
const SERVICE_WORKER_UPDATE_FOUND = 'SERVICE_WORKER_UPDATE_FOUND'
const SERVICE_WORKER_OFFLINE = 'SERVICE_WORKER_OFFLINE'
const SERVICE_WORKER_UPDATE_READY = 'SERVICE_WORKER_UPDATE_READY'
const SERVICE_WORKER_ERROR = 'SERVICE_WORKER_ERROR'

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

// TODO: remove me when PC-10931 is validated
const log = (text: string, err?: Error) => {
  if (__DEV__ || globalThis.window.location.origin === 'https://app.testing.passculture.team/') {
    // eslint-disable-next-line no-console
    err ? console.error(text, err) : console.log(text)
  }
}

const useServiceWorkerReducer = (
  state: ServiceWorkerState,
  action: ServiceWorkerActionTypes
): ServiceWorkerState => {
  switch (action.type) {
    case 'SERVICE_WORKER_READY':
      log('Service worker is ready.')
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_REGISTERED':
      log('Service worker has been registered.')
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_CACHED':
      log('Content has been cached for offline use.')
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_UPDATE_FOUND':
      log('New content is downloading.')
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_UPDATE_READY':
      log('New content is available; please refresh.')
      globalThis.window.pcupdate = true
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
        registration: action.payload.registration,
      }
    case 'SERVICE_WORKER_OFFLINE':
      log('No internet connection found. App is running in offline mode.')
      return {
        ...state,
        serviceWorkerStatus: action.payload.serviceWorkerStatus,
      }
    case 'SERVICE_WORKER_ERROR':
      log('Error during service worker registration:', action.payload.error)
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
    return () => {
      unregister()
    }
  }, [])

  return swState
}
