import React from 'react'
import { WebView } from 'react-native-webview'

import { FAQ_URL } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'

export const FAQWebview: React.FC = () => {
  return (
    <React.Fragment>
      <PageHeaderSecondary title="Traitement des données utilisateurs" />
      <WebView source={{ uri: FAQ_URL }} testID="FAQ-webview" />
    </React.Fragment>
  )
}
