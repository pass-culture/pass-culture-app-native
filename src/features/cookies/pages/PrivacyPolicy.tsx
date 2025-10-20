import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'

import { ConsentState } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { useModal } from 'ui/components/modals/useModal'

export function PrivacyPolicy() {
  const { cookiesConsent: hasUserMadeCookieChoiceV2 } = useCookies()
  const {
    visible: cookiesConsentModalVisible,
    hideModal: hideCookiesConsentModal,
    showModal: showCookiesConsentModal,
  } = useModal(false)
  const { isCookiesListUpToDate } = useIsCookiesListUpToDate()
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

  const handleCheckScrollY = useRef(() => {
    return scrollYRef.current
  }).current

  useEffect(() => {
    switch (hasUserMadeCookieChoiceV2.state) {
      case ConsentState.LOADING:
        break

      case ConsentState.UNKNOWN:
        showCookiesConsentModal()
        break

      default:
        if (isCookiesListUpToDate) {
          hideCookiesConsentModal()
        } else {
          showCookiesConsentModal()
        }
    }
  }, [
    hasUserMadeCookieChoiceV2,
    hideCookiesConsentModal,
    isCookiesListUpToDate,
    showCookiesConsentModal,
  ])

  return (
    <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
      <CookiesConsent visible={cookiesConsentModalVisible} hideModal={hideCookiesConsentModal} />
    </AnchorProvider>
  )
}
