import { IdCheckContextProvider as IdCheckContextProviderDefault } from '@pass-culture/id-check'
import React, { memo } from 'react'

import { api } from 'api/api'
import { idCheckAnalytics } from 'libs/analytics'
import { eduConnectClient } from 'libs/eduConnectClient'
import { env } from 'libs/environment'
import { idCheckRetentionClient } from 'libs/idCheckRetentionClient'
import { eventMonitoring } from 'libs/monitoring'

const silencedCaptureMessage = () => {
  // do nothing to silence sentry message
  // use firebase if needed.
}

export const IdCheckContextProvider = memo(function IdCheckContextProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) {
  const errorMonitoringIdCheck = { ...eventMonitoring, captureMessage: silencedCaptureMessage }
  return (
    <IdCheckContextProviderDefault
      jouveApiBaseUrl={env.ID_CHECK_API_URL}
      supportEmail={env.SUPPORT_EMAIL_ADDRESS}
      dsmUrl={env.DSM_URL}
      personalDataDocUrl={env.DOC_PERSONAL_DATA_URL}
      cguDocUrl={env.DOC_CGU_URL}
      dmsFrenchCitizenshipUrl={env.DMS_FRENCH_CITIZEN_URL}
      dmsForeignCitizenshipUrl={env.DMS_FOREIGN_CITIZEN_URL}
      errorMonitoring={errorMonitoringIdCheck}
      analytics={idCheckAnalytics}
      retentionClient={idCheckRetentionClient}
      requestLicenceToken={() => api.getnativev1idCheckToken()}
      eduConnectClient={eduConnectClient}
      // TODO(anouhello) [PC-11201] set shouldUseEduConnect properly according to FF
      // enable_native_eac_individual and when underage signup process is implemented
      shouldUseEduConnect={true}>
      {children}
    </IdCheckContextProviderDefault>
  )
})
