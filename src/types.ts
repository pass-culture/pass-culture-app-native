export {}

declare global {
  // Web only
  interface Window {
    // See usage of `window.grecaptcha` in ReCaptcha.web.tsx
    grecaptcha?: {
      execute?: (widgetId?: number) => void
      ready?: (callback: () => void) => void
      render?: (
        container: HTMLElement | string,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
          size: string
          theme: string
        }
      ) => number
      reset?: (widgetId?: number) => void
    }
    onUbbleReady?: () => void
    pcupdate?: boolean
    // webdriver is injected as a workaround for safari ios, remove if later it exist and set to true while doing automation
    webdriver?: boolean
  }
}
