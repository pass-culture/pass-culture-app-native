import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const ActionPlanTag = ({ done = true }: { done?: boolean }) => {
  return <StyledButtonText done={done}>{done ? ' - Réalisé' : ' - Prochainement'}</StyledButtonText>
}

const StyledButtonText = styled(Typo.ButtonText)<{ done: boolean }>(({ theme, done }) => ({
  color: done ? theme.colors.greenValid : theme.colors.black,
}))
