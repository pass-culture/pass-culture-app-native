import React from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'

export function RequiredLabel() {
  return <StyledBodyAccentXs>Obligatoire</StyledBodyAccentXs>
}

const StyledBodyAccentXs = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
