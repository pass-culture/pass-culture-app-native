import React from 'react'
import styled from 'styled-components'

import { TextColorKey } from 'theme/types'

type InputLabelProps = React.PropsWithChildren<{
  id?: string
  accessibilityDescribedBy?: string
  accessibilityLabel?: string
  htmlFor: string
}>

const StyledLabel = styled.label<{ color?: TextColorKey }>(({ theme }) => ({
  ...theme.designSystem.typography.body,
  color: theme.designSystem.color.text.default,
  cursor: 'pointer',
}))

export const InputLabel: React.FC<InputLabelProps> = ({ children, ...props }) => {
  return <StyledLabel {...props}>{children}</StyledLabel>
}
