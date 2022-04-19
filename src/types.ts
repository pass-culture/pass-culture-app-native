export {}

declare global {
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
    onUbbleReady?: () => void
    batchSDK: (
      type?:
        | string
        | ((api: {
            getInstallationID: () => Promise<string>
            setCustomUserID: (id: string) => void
            ui: { show: (type: string) => void }
          }) => void),
      options?: {
        apiKey?: string
        subdomain?: string
        authKey?: string
        vapidPublicKey?: string
        ui: {
          native?: unknown
          alert?: unknown
        }
        defaultIcon?: string
        smallIcon?: string
        sameOrigin?: boolean
        useExistingServiceWorker?: boolean
        dev?: boolean
      }
    ) => void
    pcupdate?: boolean
  }
}
