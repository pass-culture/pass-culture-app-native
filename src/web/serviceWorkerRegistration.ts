// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

type Config = {
  registrationOptions?: RegistrationOptions
  ready?: (registration: ServiceWorkerRegistration) => void
  registered?: (registration: ServiceWorkerRegistration) => void
  cached?: (registration: ServiceWorkerRegistration) => void
  updatefound?: (registration: ServiceWorkerRegistration) => void
  updated?: (registration: ServiceWorkerRegistration) => void
  offline?: () => void
  error?: (error: Error) => void
}

type Emit = (emitKey: EmitKey, registration?: Error | ServiceWorkerRegistration) => void

type EmitKey = 'ready' | 'registered' | 'cached' | 'updatefound' | 'updated' | 'offline' | 'error'

export function register(swUrl: string, config: Config = {}) {
  const { registrationOptions = {} } = config
  delete config.registrationOptions

  const emit = (emitKey: EmitKey, payload?: Error | ServiceWorkerRegistration): void => {
    const callback = config[emitKey]
    if (callback) {
      callback(payload as never)
    }
  }

  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    // @ts-ignore process.env.PUBLIC_URL is always defined in this context
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, emit, registrationOptions)
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, emit, registrationOptions)
      }
      navigator.serviceWorker.ready
        .then((registration) => {
          emit('ready', registration)
        })
        .catch((error) => handleError(emit, error))
    })
  }
}

function handleError(emit: Emit, error: Error) {
  if (!navigator.onLine) {
    emit('offline')
  }
  emit('error', error)
}

function registerValidSW(
  swUrl: string | URL,
  emit: Emit,
  registrationOptions: RegistrationOptions
) {
  navigator.serviceWorker
    .register(swUrl, registrationOptions)
    .then((registration) => {
      emit('registered', registration)
      if (registration.waiting) {
        emit('updated', registration)
        return
      }
      registration.onupdatefound = () => {
        emit('updatefound', registration)
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              emit('updated', registration)
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              emit('cached', registration)
            }
          }
        }
      }
    })
    .catch((error) => handleError(emit, error))
}

function checkValidServiceWorker(
  swUrl: string,
  emit: Emit,
  registrationOptions: RegistrationOptions
) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type')

      // Ensure service worker exists, and that we really are getting a JS file.
      if (response.status === 404) {
        // No service worker found.
        emit('error', new Error(`Service worker not found at ${swUrl}`))
        unregister(emit)
      } else if (contentType != null && !contentType.includes('javascript')) {
        emit(
          'error',
          new Error(
            `Expected ${swUrl} to have javascript content-type, but received ${response.headers.get(
              'content-type'
            )}`
          )
        )
        unregister(emit)
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, emit, registrationOptions)
      }
    })
    .catch((error) => handleError(emit, error))
}

export function unregister(emit?: Emit) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        emit && handleError(emit, error)
      })
  }
}
