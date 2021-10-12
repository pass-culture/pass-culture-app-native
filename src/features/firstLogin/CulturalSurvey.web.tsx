import { Widget as TypeformWidget } from '@typeform/embed-react'
import React from 'react'

import { useCulturalSurveyConfig, useOnCulturalSurveyExit } from 'features/firstLogin/helpers'
import { useCurrentRoute } from 'features/navigation/helpers'
import { LoadingPage } from 'ui/components/LoadingPage'

export const CulturalSurvey: React.FC = function () {
  const currentRoute = useCurrentRoute()
  const culturalSurveyConfig = useCulturalSurveyConfig()
  const onCulturalSurveyExit = useOnCulturalSurveyExit()

  if (currentRoute?.name !== 'CulturalSurvey') {
    return null
  }
  if (!culturalSurveyConfig) {
    return <LoadingPage />
  }
  const { formId, userId, userPk, source } = culturalSurveyConfig
  return (
    <TypeformWidget
      id={formId}
      hideFooter={false}
      hideHeaders={false}
      hidden={{ userPk, userId, source }}
      onClose={() => onCulturalSurveyExit(null, userPk)}
      onSubmit={() => onCulturalSurveyExit(userId, userPk)}
      opacity={100}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ width: '100%', height: '100%' }}
    />
  )
}
