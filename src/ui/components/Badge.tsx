import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const Badge: React.FunctionComponent<IconInterface & { label: string | number }> = ({
  label,
  testID,
}) => (
  <Container testID={testID}>
    <Caption>{label}</Caption>
  </Container>
)

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const Container = styled.View(({ theme }) => ({
  background: theme.colors.primary,
  height: getSpacing(4),
  borderRadius: getSpacing(2),
  paddingHorizontal: getSpacing(2),
}))
