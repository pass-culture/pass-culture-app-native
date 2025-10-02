import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export type RequiredIndicator = 'short' | 'long'

type RequiredLabelProps = {
  indicator?: RequiredIndicator
  lowercase?: boolean
}

export function RequiredLabel({ indicator = 'long', lowercase = false }: RequiredLabelProps) {
  const label = indicator === 'short' ? '*' : lowercase ? '\u00a0-\u00a0obligatoire' : 'Obligatoire'
  return <StyledBodyAccentXs>{label}</StyledBodyAccentXs>
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
