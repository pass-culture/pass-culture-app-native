export {}

type NotAny<T> = 0 extends 1 & T ? never : T

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type NumberRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

declare global {
  interface Date {
    getDay(): NumberRange<0, 7>

    getMonth(): NumberRange<0, 12>

    getDate(): NumberRange<0, 31>
  }

  interface ObjectConstructor {
    keys<T extends object>(obj: NotAny<T>): (keyof T)[]
    keys(obj: unknown): string[]
  }

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
