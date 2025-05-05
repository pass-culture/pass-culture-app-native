import React, { useCallback, useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import { getCookiesModalContent } from 'features/cookies/components/getCookiesModalContent'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesSteps } from 'features/cookies/enums'
import { getCookiesChoiceFromCategories } from 'features/cookies/helpers/getCookiesChoiceFromCategories'
import { setMarketingParams } from 'features/cookies/helpers/setMarketingParams'
import { startTracking } from 'features/cookies/helpers/startTracking'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesChoiceByCategory, UTMParams } from 'features/cookies/types'
import { navigationRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/analytics/provider'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const route = navigationRef.getCurrentRoute() as UTMParams
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)
  const [settingsCookiesChoice, setSettingsCookiesChoice] = useState<CookiesChoiceByCategory>({
    customization: false,
    performance: false,
    marketing: false,
  })
  const { setCookiesConsent } = useCookies()

  const params = route?.params
  const acceptAll = useCallback(async () => {
    hideModal()
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: ALL_OPTIONAL_COOKIES,
      refused: [],
    })
    startTracking(true)
    analytics.logHasAcceptedAllCookies()
    await setMarketingParams(params, ALL_OPTIONAL_COOKIES)
  }, [params, hideModal, setCookiesConsent])

  const declineAll = useCallback(() => {
    hideModal()
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: [],
      refused: ALL_OPTIONAL_COOKIES,
    })
    startTracking(false)
  }, [hideModal, setCookiesConsent])

  const customChoice = useCallback(async () => {
    hideModal()
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
    await setMarketingParams(params, accepted)
  }, [params, settingsCookiesChoice, hideModal, setCookiesConsent])

  const { childrenProps } = getCookiesModalContent({
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
