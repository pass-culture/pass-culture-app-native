import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="CulturalSurvey 🎨">
      <LinkToComponent screen="CulturalSurveyIntro" />
      <LinkToComponent screen="CulturalSurveyQuestions" />
      <LinkToComponent screen="CulturalSurveyThanks" />
    </CheatcodesTemplateScreen>
  )
}
