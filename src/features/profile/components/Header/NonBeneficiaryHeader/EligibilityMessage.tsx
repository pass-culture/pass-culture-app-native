import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'

interface EligibilityMessageProps {
  formattedEligibilityEndDatetime?: string
}

export function EligibilityMessage({
  formattedEligibilityEndDatetime,
}: PropsWithChildren<EligibilityMessageProps>) {
  return (
    <Container>
      <Subtitle
        startSubtitle="Tu es éligible jusqu’au"
        boldEndSubtitle={formattedEligibilityEndDatetime}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
