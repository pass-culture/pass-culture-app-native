import { NavigationContainerRef } from '@react-navigation/native'
import React, { RefObject, useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { AllNavParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'

interface Props {
  navigationRef?: RefObject<NavigationContainerRef<AllNavParamList>>
}

export function PrivacyPolicy(props: Props) {
  const [hasUserMadeCookieChoice, setHasUserMadeCookieChoice] = useState(true)

  useEffect(() => {
    storage.readObject('has_accepted_cookie').then((hasAcceptedCookie) => {
      if (hasAcceptedCookie === null) {
        setHasUserMadeCookieChoice(false)
      }
    })
  }, [])

  function acceptCookie() {
    setHasUserMadeCookieChoice(true)
    storage.saveObject('has_accepted_cookie', true)
  }

  async function refuseCookie() {
    setHasUserMadeCookieChoice(true)
    await storage.saveObject('has_accepted_cookie', false)
    await analytics.logHasRefusedCookie()
    await analytics.disableCollection()
  }

  return hasUserMadeCookieChoice ? null : (
    <PrivacyPolicyModal
      visible={true}
      onApproval={acceptCookie}
      onRefusal={refuseCookie}
      navigationRef={props.navigationRef}
      disableBackdropTap
    />
  )
}
