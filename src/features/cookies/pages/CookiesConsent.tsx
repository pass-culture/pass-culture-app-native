import React, { useCallback, useState } from 'react'

import { usePostCookiesConsent } from 'features/cookies/api/usePostCookiesConsent'
import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import { useCookiesModalContent } from 'features/cookies/components/useCookiesModalContent'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesSteps } from 'features/cookies/enums'
import { getCookiesChoiceFromCategories } from 'features/cookies/helpers/getCookiesChoiceFromCategories'
import { startTracking } from 'features/cookies/helpers/startTracking'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesChoiceByCategory } from 'features/cookies/types'
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
  const { mutate: postCookiesConsent } = usePostCookiesConsent()

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
    postCookiesConsent()
    hideModal()
  }, [hideModal, setCookiesConsent, postCookiesConsent])

  const declineAll = useCallback(() => {
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: [],
      refused: ALL_OPTIONAL_COOKIES,
    })
    startTracking(false)
    campaignTracker.startAppsFlyer(false)
    requestIDFATrackingConsent()
    postCookiesConsent()
    hideModal()
  }, [hideModal, setCookiesConsent, postCookiesConsent])

  const customChoice = useCallback(() => {
    const { accepted, refused } = getCookiesChoiceFromCategories(settingsCookiesChoice)
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted,
      refused,
    })
    startTrackingAcceptedCookies(accepted)
    analytics.logHasMadeAChoiceForCookies({
      from: 'Modal',
      type: settingsCookiesChoice,
    })
    requestIDFATrackingConsent()
    postCookiesConsent()
    hideModal()
  }, [settingsCookiesChoice, hideModal, setCookiesConsent, postCookiesConsent])

  const { childrenProps } = useCookiesModalContent({
    cookiesStep,
    settingsCookiesChoice,
    setCookiesStep,
    setSettingsCookiesChoice,
    acceptAll,
    declineAll,
    customChoice,
  })

  return <CookiesConsentModal visible={visible} {...childrenProps} />
}
