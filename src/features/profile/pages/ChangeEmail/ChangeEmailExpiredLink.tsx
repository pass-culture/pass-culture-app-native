import React from 'react'

import { LayoutExpiredLink } from 'features/profile/pages/ChangeEmail/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  const changeEmailExpiredLink = () => {
    // TODO (LucasBeneston): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  // TODO (LucasBeneston): use isFetching from useQuery()
  const isFetching = true

  return <LayoutExpiredLink resetQuery={changeEmailExpiredLink} isFetching={isFetching} />
}
