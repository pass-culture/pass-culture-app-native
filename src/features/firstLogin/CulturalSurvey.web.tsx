import { Widget as TypeformWidget } from '@typeform/embed-react'
import React from 'react'

import { withCulturalSurveyProvider } from 'features/firstLogin/helpers'

export const CulturalSurvey: React.FC = withCulturalSurveyProvider(function (props) {
  const { formId, userId, userPk, source } = props.culturalSurveyConfig
  return (
    <TypeformWidget
      id={formId}
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
