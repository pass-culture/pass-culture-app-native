import React from 'react'

import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { Typo } from 'ui/theme'

export const CheatcodesScreenGenericErrorPage = () => {
  return (
    <GenericErrorPage title="Title" icon={MaintenanceCone}>
      <Typo.Body>Children...</Typo.Body>
    </GenericErrorPage>
  )
}
