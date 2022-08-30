import React, { useCallback, useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/useCookies'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)
  const { cookiesChoice, setCookiesChoice } = useCookies()

  const acceptAll = useCallback(() => {
    setCookiesChoice({
      ...cookiesChoice,
      choiceDatetime: new Date(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      },
    })
    hideModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookiesChoice])

  const declineAll = useCallback(() => {
    setCookiesChoice({
      ...cookiesChoice,
      choiceDatetime: new Date(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      },
    })
    hideModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookiesChoice])

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
