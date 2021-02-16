import React, { useEffect } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { storage } from 'libs/storage'

export function PrivacyPolicy() {
  const [shouldShowModal, setShouldShowModal] = React.useState(false)

  useEffect(() => {
    storage.readObject('has_accepted_cookie').then((hasAcceptedCookie) => {
      if (hasAcceptedCookie === null) {
        setShouldShowModal(true)
      }
    })
  }, [])

  function acceptCookie() {
    setShouldShowModal(false)
    storage.saveObject('has_accepted_cookie', true)
  }

  return shouldShowModal ? <PrivacyPolicyModal visible dismissModal={acceptCookie} /> : null
}
