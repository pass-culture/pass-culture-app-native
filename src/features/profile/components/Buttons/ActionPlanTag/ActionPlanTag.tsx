import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export enum ActionPlanStatus {
  DONE = 'Réalisé',
  ONGOING = 'En cours',
  TODO = 'Prochainement',
}

export const ActionPlanTag = ({
  status = ActionPlanStatus.DONE,
  details,
}: {
  status?: ActionPlanStatus
  details?: string
}) => {
  return (
    <StyledButtonText done={status === ActionPlanStatus.DONE}>
      {SPACE}- {status}
      {details && ` - ${details}`}
    </StyledButtonText>
  )
}

const StyledButtonText = styled(Typo.BodyAccent)<{ done: boolean }>(({ theme, done }) => ({
  color: done ? theme.designSystem.color.text.success : theme.designSystem.color.text.default,
}))
