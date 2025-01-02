import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="CulturalSurvey 🎨">
      <LinkToScreen screen="CulturalSurveyIntro" />
      <LinkToScreen screen="CulturalSurveyQuestions" />
      <LinkToScreen screen="CulturalSurveyThanks" />
    </CheatcodesTemplateScreen>
  )
}
