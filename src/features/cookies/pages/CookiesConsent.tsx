import React, { useCallback, useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { getCookiesChoiceFromCategories } from 'features/cookies/getCookiesChoiceFromCategories'
import { useCookies } from 'features/cookies/useCookies'
import { CookiesChoiceByCategory } from 'features/cookies/useCookiesChoiceByCategory'

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

  const acceptAll = useCallback(() => {
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: ALL_OPTIONAL_COOKIES,
      refused: [],
    })
    hideModal()
  }, [hideModal, setCookiesConsent])

  const declineAll = useCallback(() => {
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: [],
      refused: ALL_OPTIONAL_COOKIES,
    })
    hideModal()
  }, [hideModal, setCookiesConsent])

  const customChoice = useCallback(() => {
    const { accepted, refused } = getCookiesChoiceFromCategories(settingsCookiesChoice)
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted,
      refused,
    })
    hideModal()
  }, [settingsCookiesChoice, hideModal, setCookiesConsent])

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
