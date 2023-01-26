import React from 'react'
import { WebView } from 'react-native-webview'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'

export const FAQWebview: React.FC = () => {
  return (
    <React.Fragment>
      <PageHeaderSecondary title="Traitement des données utilisateurs" />
      <WebView source={{ uri: FAQ_LINK_USER_DATA }} testID="FAQ-webview" />
    </React.Fragment>
  )
}
