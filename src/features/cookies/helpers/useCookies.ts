import { useCallback, useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { Consent, CookiesConsent } from 'features/cookies/types'
import { getAppBuildVersion } from 'libs/packageJson'
import { BatchPush } from 'libs/react-native-batch'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'
import { storage } from 'libs/storage'

import { usePersistCookieConsentMutation } from '../queries/usePersistCookieConsentMutation/usePersistCookieConsentMutation'

import { COOKIES_CONSENT_KEY } from './cookiesConsentKey'

export const getCookiesChoice = async () => storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

const removeCookiesConsentAndChoiceDate = async (cookiesChoice: CookiesConsent): Promise<void> => {
  await storage.saveObject(COOKIES_CONSENT_KEY, {
    ...cookiesChoice,
    choiceDatetime: undefined,
    consent: undefined,
  })
}

export const useCookies = () => {
  const cookiesConsentInternalState = useCookiesConsentStore((state) => state.cookiesConsent)
  const { user: userProfileInfo } = useAuthContext()
  const { mutateAsync: persist } = usePersistCookieConsentMutation()

  const loadCookiesConsent = useCallback(() => {
    const { isInitialized, cookiesConsent, setCookiesConsentState } =
      useCookiesConsentStore.getState()

    if (isInitialized && cookiesConsent.state !== ConsentState.LOADING) {
      return
    }

    void (async () => {
      const cookies = await getCookiesChoice()
      if (cookies) {
        setConsentAndChoiceDateTime(cookies)
      } else {
        setCookiesConsentState({ state: ConsentState.UNKNOWN })
      }
    })()
  }, [])

  useEffect(() => {
    loadCookiesConsent()
  }, [loadCookiesConsent])

  const setCookiesConsent = async (cookiesConsent: Consent) => {
    const oldCookiesChoice = await getCookiesChoice()
    const deviceId = await getDeviceId()

    const newCookiesChoice: CookiesConsent = {
      buildVersion: getAppBuildVersion(),
      userId: oldCookiesChoice?.userId ?? userProfileInfo?.id,
      deviceId: oldCookiesChoice?.deviceId ?? deviceId,
      choiceDatetime: new Date().toISOString(),
      consent: cookiesConsent,
    }

    await persist(newCookiesChoice)

    useCookiesConsentStore
      .getState()
      .setCookiesConsentState({ state: ConsentState.HAS_CONSENT, value: cookiesConsent })

    if (cookiesConsent.accepted.includes(CookieNameEnum.BATCH)) {
      BatchPush.requestNotificationAuthorization() // For iOS and Android 13
    }
  }

  const setUserId = async (userId: number): Promise<void> => {
    const oldCookiesChoice = await getCookiesChoice()
    const deviceId = await getDeviceId()

    if (!oldCookiesChoice) {
      const newCookiesChoice: CookiesConsent = {
        userId,
        deviceId,
        buildVersion: getAppBuildVersion(),
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
    cookiesConsent: cookiesConsentInternalState,
    setCookiesConsent,
    setUserId,
    loadCookiesConsent,
  }
}

const setConsentAndChoiceDateTime = (cookies: CookiesConsent) => {
  const { setCookiesConsentState } = useCookiesConsentStore.getState()

  if (cookies.consent) {
    setCookiesConsentState({
      state: ConsentState.HAS_CONSENT,
      value: cookies.consent,
    })
    startTrackingAcceptedCookies(cookies.consent.accepted)
  } else {
    setCookiesConsentState({ state: ConsentState.UNKNOWN })
  }

  if (cookies.choiceDatetime && isConsentChoiceExpired(new Date(cookies.choiceDatetime))) {
    void removeCookiesConsentAndChoiceDate(cookies)
    setCookiesConsentState({ state: ConsentState.UNKNOWN })
  }
}
