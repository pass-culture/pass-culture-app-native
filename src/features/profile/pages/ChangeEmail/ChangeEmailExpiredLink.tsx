import React from 'react'

import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  const changeEmailExpiredLink = () => {
    // TODO (LucasBeneston): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  // TODO (LucasBeneston): use isFetching from useQuery()
  const isFetching = false

  return <LayoutExpiredLink resetQuery={changeEmailExpiredLink} isFetching={isFetching} />
}
