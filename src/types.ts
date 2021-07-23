export interface IUser {
  activity: string | null
  address: string | null
  canBookFreeOffers: boolean
  city: string | null
  civility: string | null
  dateCreated: string
  dateOfBirth: string | null
  departementCode: string
  email: string
  firstName: string
  hasOffers: boolean
  hasPhysicalVenues: boolean
  id: string
  isAdmin: boolean
  lastConnectionDate: string | null
  lastName: string
  needsToFillCulturalSurvey: boolean
  phoneNumber: string | null
  postalCode: string
  publicName: string
}

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
  }
}
