import React, { useCallback, useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { getCookiesChoiceFromCategories } from 'features/cookies/getCookiesChoiceFromCategories'
import { startTracking } from 'features/cookies/startTracking'
import { useCookies } from 'features/cookies/useCookies'
import { CookiesChoiceByCategory } from 'features/cookies/useCookiesChoiceByCategory'
import { useLogCookiesConsent } from 'features/cookies/useLogCookiesConsent'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)
  const [settingsCookiesChoice, setSettingsCookiesChoice] = useState<CookiesChoiceByCategory>({
    customization: false,
    performance: false,
    marketing: false,
  })
  const { setCookiesConsent } = useCookies()
  const { mutate: logCookiesConsent } = useLogCookiesConsent()

  const acceptAll = useCallback(() => {
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: ALL_OPTIONAL_COOKIES,
      refused: [],
    })
    startTracking(true)
    campaignTracker.startAppsFlyer(true)
    analytics.logHasAcceptedAllCookies()
    requestIDFATrackingConsent()
    logCookiesConsent()
    hideModal()
  }, [hideModal, setCookiesConsent, logCookiesConsent])

  const declineAll = useCallback(() => {
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: [],
      refused: ALL_OPTIONAL_COOKIES,
    })
    startTracking(false)
    campaignTracker.startAppsFlyer(false)
    requestIDFATrackingConsent()
    logCookiesConsent()
    hideModal()
  }, [hideModal, setCookiesConsent, logCookiesConsent])

  const customChoice = useCallback(() => {
    const { accepted, refused } = getCookiesChoiceFromCategories(settingsCookiesChoice)
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted,
      refused,
    })
    startTracking(settingsCookiesChoice.performance)
    campaignTracker.startAppsFlyer(settingsCookiesChoice.marketing)
    analytics.logHasMadeAChoiceForCookies({ from: 'Modal', type: settingsCookiesChoice })
    requestIDFATrackingConsent()
    logCookiesConsent()
    hideModal()
  }, [settingsCookiesChoice, hideModal, setCookiesConsent, logCookiesConsent])

  const { childrenProps } = useCookiesModalContent({
    cookiesStep,
    settingsCookiesChoice,
    setCookiesStep,
    setSettingsCookiesChoice,
    acceptAll,
    declineAll,
    customChoice,
  })

  return (
    <CookiesConsentModal
      visible={visible}
      rightIconAccessibilityLabel={undefined}
      rightIcon={undefined}
      onRightIconPress={undefined}
      {...childrenProps}
    />
  )
}
