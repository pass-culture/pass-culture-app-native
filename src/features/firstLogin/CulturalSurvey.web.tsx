import { useNavigation } from '@react-navigation/native'
import { Widget as TypeformWidget } from '@typeform/embed-react'
import React, { useEffect } from 'react'

import { useSettingsContext } from 'features/auth/SettingsContext'
import { withCulturalSurveyProvider } from 'features/firstLogin/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const CulturalSurvey: React.FC = withCulturalSurveyProvider(function (props) {
  const { formId, userId, userPk, source } = props.culturalSurveyConfig
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings } = useSettingsContext()

  useEffect(() => {
    // make sure we redirect to the right cultural survey if feature flag is activated
    if (settings?.enableNativeCulturalSurvey) {
      navigate('CulturalSurveyIntro')
    }
  })
  return (
    <TypeformWidget
      id={formId}
      iframeProps={{ title: 'Questionnaire culturel' }}
      hideFooter={false}
      hideHeaders={false}
      hidden={{ userPk, userId, source }}
      onClose={() => props.onCulturalSurveyExit(null, userPk)}
      onSubmit={() => props.onCulturalSurveyExit(userId, userPk)}
      opacity={100}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ width: '100%', height: '100%' }}
    />
  )
})
