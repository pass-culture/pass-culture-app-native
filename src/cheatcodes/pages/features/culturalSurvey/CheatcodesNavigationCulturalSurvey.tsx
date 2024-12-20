import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="CulturalSurvey 🎨">
      <LinkToComponent name="CulturalSurveyIntro" />
      <LinkToComponent name="CulturalSurveyQuestions" />
      <LinkToComponent name="CulturalSurveyThanks" />
    </CheatcodesTemplateScreen>
  )
}
