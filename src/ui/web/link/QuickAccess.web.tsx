import React from 'react'
import styled from 'styled-components'

import { QuickAccessProps } from 'ui/web/link/types'

export const QuickAccess = ({ href, title }: QuickAccessProps) => (
  <StyledA href={href}>{title}</StyledA>
)

const StyledA = styled.a(({ theme }) => ({
  ...theme.typography.buttonText,
  backgroundColor: theme.colors.white,
  zIndex: theme.zIndex.floatingButton,
  textDecoration: 'none',
  position: 'absolute',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  '&:focus': {
    width: '100px',
    height: theme.navTopHeight,
  },
}))
