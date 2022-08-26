import React, { useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'
import { allOptionalCookies, COOKIES_BY_CATEGORY } from 'features/cookies/cookiesPolicy'
import { useCookies } from 'features/cookies/useCookies'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const { cookiesChoice, setCookiesChoice } = useCookies()
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)

  const acceptAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      },
    })
    hideModal()
  }

  const declineAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: allOptionalCookies,
      },
    })
    hideModal()
  }

  const customChoice = () => {
    hideModal()
  }

  const { childrenProps } = useCookiesModalContent({
    cookiesStep,
    setCookiesStep,
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
