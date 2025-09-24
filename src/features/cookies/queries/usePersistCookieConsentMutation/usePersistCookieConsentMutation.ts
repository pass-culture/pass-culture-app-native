import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'

import { api } from 'api/api'
import { CookiesConsent } from 'features/cookies/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

import { COOKIES_CONSENT_KEY } from '../../helpers/cookiesConsentKey'

export const usePersistCookieConsentMutation = () => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useMutation({
    mutationFn: async (cookiesChoice: CookiesConsent): Promise<void> => {
      await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)

      try {
        if (cookiesChoice.consent) {
          await api.postNativeV1CookiesConsent(omit(cookiesChoice, ['buildVersion']))
        }
      } catch (error) {
        if (logType === LogTypeEnum.INFO) {
          const errorMessage = getErrorMessage(error)
          eventMonitoring.captureException(
            `can‘t log cookies consent choice ; reason: "${errorMessage}"`,
            { level: logType, extra: { error } }
          )
        }
      }
    },
  })
}
