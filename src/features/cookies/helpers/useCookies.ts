import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { Consent, ConsentStatus, CookiesConsent } from 'features/cookies/types'
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
  const [cookiesConsentInternalState, setCookiesConsentInternalState] = useState<ConsentStatus>({
    state: ConsentState.LOADING,
  })
  const { user: userProfileInfo } = useAuthContext()
  const { mutateAsync: persist } = usePersistCookieConsentMutation()

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
      buildVersion: getAppBuildVersion(),
      userId: oldCookiesChoice?.userId ?? userProfileInfo?.id,
      deviceId: oldCookiesChoice?.deviceId ?? deviceId,
      choiceDatetime: new Date().toISOString(),
      consent: cookiesConsent,
    }

    await persist(newCookiesChoice)
    if (cookiesConsent.accepted.includes(CookieNameEnum.BATCH)) {
      BatchPush.requestNotificationAuthorization()
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
