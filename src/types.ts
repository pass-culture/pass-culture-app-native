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
    pcupdate?: boolean
    // webdriver is injected as a workaround for safari ios, remove if later it exist and set to true while doing automation
    webdriver?: boolean
  }
}
