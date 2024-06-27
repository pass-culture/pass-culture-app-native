import omit from 'lodash/omit'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ConsentState } from 'features/cookies/enums'
import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { Consent, ConsentStatus, CookiesConsent } from 'features/cookies/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { eventMonitoring } from 'libs/monitoring'
import { getAppBuildVersion } from 'libs/packageJson'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'
import { storage } from 'libs/storage'

const COOKIES_CONSENT_KEY = 'cookies'

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
  const { mutateAsync: persist } = usePersistCookieConsent()

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

const usePersistCookieConsent = () => {
  const { shouldLogInfo } = useRemoteConfigContext()

  return useMutation(async (cookiesChoice: CookiesConsent): Promise<void> => {
    await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)

    try {
      if (cookiesChoice.consent) {
        await api.postNativeV1CookiesConsent(omit(cookiesChoice, ['buildVersion']))
      }
    } catch (error) {
      if (shouldLogInfo)
        eventMonitoring.captureException(
          `can‘t log cookies consent choice ; reason: "${
            error instanceof Error ? error.message : undefined
          }"`,
          { level: 'info' }
        )
    }
  })
}
