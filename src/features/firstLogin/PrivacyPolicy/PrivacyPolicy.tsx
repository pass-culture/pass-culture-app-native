import React, { useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { storage } from 'libs/storage'

export function PrivacyPolicy() {
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

  if (hasUserMadeCookieChoice) {
    return null
  }
  return <PrivacyPolicyModal visible dismissModal={acceptCookie} />
}
