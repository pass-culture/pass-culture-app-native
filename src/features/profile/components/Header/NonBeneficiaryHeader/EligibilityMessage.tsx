import React, { PropsWithChildren } from 'react'

import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { Spacer } from 'ui/theme'

interface EligibilityMessageProps {
  formattedEligibilityEndDatetime?: string
}

export function EligibilityMessage({
  formattedEligibilityEndDatetime,
}: PropsWithChildren<EligibilityMessageProps>) {
  return (
    <React.Fragment>
      <Subtitle
        startSubtitle="Tu es éligible jusqu’au"
        boldEndSubtitle={formattedEligibilityEndDatetime}
      />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}
