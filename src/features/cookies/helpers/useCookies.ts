import omit from 'lodash/omit'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ConsentState } from 'features/cookies/enums'
import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { Consent, CookiesConsent, ConsentStatus } from 'features/cookies/types'
import { eventMonitoring } from 'libs/monitoring'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'
import { storage } from 'libs/storage'

import Package from '../../../../package.json'

const COOKIES_CONSENT_KEY = 'cookies'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

const removeCookiesConsentAndChoiceDate = async (cookiesChoice: CookiesConsent): Promise<void> => {
  await storage.saveObject(COOKIES_CONSENT_KEY, {
    ...cookiesChoice,
    choiceDatetime: undefined,
    consent: undefined,
  })
}

export const useCookies = () => {
  const [cookiesConsent, setCookiesConsentInternalState] = useState<ConsentStatus>({
    state: ConsentState.LOADING,
  })
  const { user: userProfileInfo } = useAuthContext()
  const { mutate: persist } = usePersistCookieConsent()

  useEffect(() => {
    getCookiesChoice().then((cookies) => {
      if (cookies) {
        setConsentAndChoiceDateTime(cookies, setCookiesConsentInternalState)
      } else {
        setCookiesConsentInternalState({ state: ConsentState.UNKNOWN })
      }
    })
  }, [])

  const setCookiesConsent = async (cookiesConsent: Consent) => {
    setCookiesConsentInternalState({ state: ConsentState.HAS_CONSENT, value: cookiesConsent })

    const oldCookiesChoice = await getCookiesChoice()
    const deviceId = await getDeviceId()

    const newCookiesChoice: CookiesConsent = {
      buildVersion: Package.build,
      userId: oldCookiesChoice?.userId ?? userProfileInfo?.id,
      deviceId: oldCookiesChoice?.deviceId ?? deviceId,
      choiceDatetime: new Date().toISOString(),
      consent: cookiesConsent,
    }

    await persist(newCookiesChoice)
  }

  const setUserId = async (userId: number): Promise<void> => {
    const oldCookiesChoice = await getCookiesChoice()
    const deviceId = await getDeviceId()

    if (!oldCookiesChoice) {
      const newCookiesChoice: CookiesConsent = {
        userId,
        deviceId,
        buildVersion: Package.build,
      }
      await persist(newCookiesChoice)
    } else if (oldCookiesChoice.userId !== userId) {
      const newCookiesChoice: CookiesConsent = {
        ...oldCookiesChoice,
        userId,
      }
      await persist(newCookiesChoice)
    }
  }

  return {
    cookiesConsent,
    setCookiesConsent,
    setUserId,
  }
}

const setConsentAndChoiceDateTime = (
  cookies: CookiesConsent,
  setCookiesConsentInternalState: Dispatch<SetStateAction<ConsentStatus>>
) => {
  if (cookies.consent) {
    setCookiesConsentInternalState({
      state: ConsentState.HAS_CONSENT,
      value: cookies.consent,
    })
    startTrackingAcceptedCookies(cookies.consent.accepted)
  } else {
    setCookiesConsentInternalState({ state: ConsentState.UNKNOWN })
  }

  if (cookies.choiceDatetime) {
    if (isConsentChoiceExpired(new Date(cookies.choiceDatetime))) {
      removeCookiesConsentAndChoiceDate(cookies)
      setCookiesConsentInternalState({ state: ConsentState.UNKNOWN })
    }
  }
}

const usePersistCookieConsent = () => {
  return useMutation(
    async (cookiesChoice: CookiesConsent) => {
      await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)

      if (cookiesChoice.consent) {
        await api.postnativev1cookiesConsent(omit(cookiesChoice, ['buildVersion']))
      }
    },
    {
      onError: () => {
        eventMonitoring.captureException(new Error("can't log cookies consent choice"))
      },
    }
  )
}
