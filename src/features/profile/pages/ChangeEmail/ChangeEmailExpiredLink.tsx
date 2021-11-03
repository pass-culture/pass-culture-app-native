import React from 'react'

import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  const changeEmailExpiredLink = () => {
    // TODO (LucasBeneston): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  // TODO (LucasBeneston): use isFetching from useQuery()
  const isFetching = false

  const contactSupport = () => {
    // TODO (PC-11602): Add contactSupport + analytics
  }

  return (
    <LayoutExpiredLink
      onResendEmail={changeEmailExpiredLink}
      disabledResendEmailButton={isFetching}
      contactSupport={contactSupport}
    />
  )
}
