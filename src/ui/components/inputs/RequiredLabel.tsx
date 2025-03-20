import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export function RequiredLabel() {
  return <StyledBodyAccentXs>Obligatoire</StyledBodyAccentXs>
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
