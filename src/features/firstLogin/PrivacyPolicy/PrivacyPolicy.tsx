import { NavigationContainerRef } from '@react-navigation/native'
import React, { RefObject, useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { storage } from 'libs/storage'

interface Props {
  navigationRef?: RefObject<NavigationContainerRef>
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

  return hasUserMadeCookieChoice ? null : (
    <PrivacyPolicyModal
      visible={true}
      dismissModal={acceptCookie}
      navigationRef={props.navigationRef}
    />
  )
}
