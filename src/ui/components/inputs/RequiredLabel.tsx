import React from 'react'
import styled from 'styled-components/native'

import { RequiredIndicator } from 'ui/components/inputs/types'
import { Typo } from 'ui/theme'

type RequiredLabelProps = {
  indicator?: RequiredIndicator
  lowercase?: boolean
}

export function RequiredLabel({ indicator = 'explicit', lowercase = false }: RequiredLabelProps) {
  const label =
    indicator === 'symbol' ? '*' : lowercase ? '\u00a0-\u00a0obligatoire' : 'Obligatoire'
  return <StyledBodyAccentXs>{label}</StyledBodyAccentXs>
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
