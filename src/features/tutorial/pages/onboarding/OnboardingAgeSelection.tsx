import React, { FunctionComponent } from 'react'

import { OnboardingPage } from 'features/tutorial/pages/onboarding/OnboardingPage'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { Spacer } from 'ui/theme'
import { AgeSelectionButtons } from 'features/tutorial/components/AgeSelectionButtons'

export const AgeSelection: FunctionComponent = () => {
  return (
    <OnboardingPage
      title="Pour commencer, peux-tu nous dire ton âge&nbsp;?"
      subtitle="Cela permet de savoir si tu peux bénéficier du pass Culture.">
      <AccessibilityList
        items={AgeSelectionButtons}
        Separator={<Spacer.Column numberOfSpaces={4} />}
      />
    </OnboardingPage>
  )
}
