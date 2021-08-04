export {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      setMustUpdateApp?: (input: boolean) => void
    }
  }

  // Web only
  interface Window {
    // See usage of `window.grecaptcha` in ReCaptcha.web.tsx
    grecaptcha?: {
      execute?: () => void
      ready?: (callback: () => void) => void
      render?: (
        containerId: string,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
          size: string
          theme: string
        }
      ) => void
      reset?: () => void
    }
    batchSDK: (
      type?:
        | string
        | ((api: {
            setCustomUserID: (id: string) => void
            ui: { show: (type: string) => void }
          }) => void),
      options?: {
        apiKey: string | undefined
        subdomain?: string | undefined
        authKey: string | undefined
        vapidPublicKey: string | undefined
        ui: {
          native?: unknown
          alert?: {
            icon: string
          }
        }
        defaultIcon?: string
        smallIcon?: string
        sameOrigin?: boolean
        useExistingServiceWorker?: boolean
        dev?: boolean
      }
    ) => void
  }
}
