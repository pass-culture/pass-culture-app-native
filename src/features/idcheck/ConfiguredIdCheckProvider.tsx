import { t } from '@lingui/macro'
import { IdCheckContextProvider } from '@pass-culture/id-check'
import React, { FunctionComponent } from 'react'

import { api } from 'api/api'
import { env } from 'libs/environment'
import { errorMonitoring } from 'libs/errorMonitoring'
import { idCheckAnalytics } from 'libs/idCheckAnalytics'
import { idCheckRetentionClient } from 'libs/idCheckRetentionClient'

export const ConfiguredIdCheckProvider: FunctionComponent = function (props) {
  return (
    <IdCheckContextProvider
      imagePickerOptions={{
        title: t`Où se trouve votre document ?`,
        cancelButtonTitle: t`Plus tard`,
        takePhotoButtonTitle: t`Prendre une photo`,
        chooseFromLibraryButtonTitle: t`Photothèque`,
        chooseWhichLibraryTitle: t`Où se trouve votre copie ?`,
        permissionDenied: {
          title: t`Des permissions sont nécessaires`,
          text: t`pour prendre votre document en photo ou le sélectionner depuis vos fichiers`,
          reTryTitle: t`Recommencer`,
          okTitle: t`OK`,
        },
        maxWidth: 3000,
        maxHeight: 3000,
        quality: 0.7,
      }}
      apiBaseUrl={env.ID_CHECK_API_URL}
      supportEmail={env.SUPPORT_EMAIL_ADDRESS}
      dsmUrl={env.DSM_URL}
      personalDataDocUrl={env.DOC_PERSONAL_DATA_URL}
      cguDocUrl={env.DOC_CGU_URL}
      errorMonitoring={errorMonitoring}
      analytics={idCheckAnalytics}
      retentionClient={idCheckRetentionClient}
      requestLicenceToken={() => api.getnativev1idCheckToken()}>
      {props.children}
    </IdCheckContextProvider>
  )
}
