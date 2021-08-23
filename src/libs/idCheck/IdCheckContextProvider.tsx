import { IdCheckContextProvider as IdCheckContextProviderDefault } from '@pass-culture/id-check'
import React, { memo } from 'react'

import { api } from 'api/api'
import { idCheckAnalytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { errorMonitoring } from 'libs/errorMonitoring'
import { idCheckRetentionClient } from 'libs/idCheckRetentionClient'

export const IdCheckContextProvider = memo(function IdCheckContextProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) {
  return (
    <IdCheckContextProviderDefault
      apiBaseUrl={env.ID_CHECK_API_URL}
      supportEmail={env.SUPPORT_EMAIL_ADDRESS}
      dsmUrl={env.DSM_URL}
      personalDataDocUrl={env.DOC_PERSONAL_DATA_URL}
      cguDocUrl={env.DOC_CGU_URL}
      errorMonitoring={errorMonitoring}
      analytics={idCheckAnalytics}
      retentionClient={idCheckRetentionClient}
      requestLicenceToken={() => api.getnativev1idCheckToken()}>
      {children}
    </IdCheckContextProviderDefault>
  )
})
