import React from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'

export enum ActionPlanStatus {
  DONE = 'Réalisé',
  ONGOING = 'En cours',
  TODO = 'Prochainement',
}

export const ActionPlanTag = ({
  status = ActionPlanStatus.DONE,
}: {
  status?: ActionPlanStatus
}) => {
  return <StyledButtonText done={status === ActionPlanStatus.DONE}> - {status}</StyledButtonText>
}

const StyledButtonText = styled(TypoDS.BodyAccent)<{ done: boolean }>(({ theme, done }) => ({
  color: done ? theme.colors.greenValid : theme.colors.black,
}))
