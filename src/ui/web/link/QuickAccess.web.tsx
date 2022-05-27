import React from 'react'
import styled from 'styled-components'

import { getSpacing } from 'ui/theme'

type QuickAccessProps = {
  href: string
  title: string
}

export const QuickAccess = ({ href, title }: QuickAccessProps) => (
  <StyledA href={href}>{title}</StyledA>
)

const StyledA = styled.a(({ theme }) => ({
  ...theme.typography.buttonText,
  color: theme.uniqueColors.brand,
  backgroundColor: theme.colors.white,
  zIndex: theme.zIndex.floatingButton,
  textDecoration: 'none',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  clipPath: 'inset(50%)',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  '&:focus': {
    clipPath: 'none',
    width: 'auto',
    height: getSpacing(11),
    margin: getSpacing(2),
    paddingLeft: getSpacing(4),
    paddingRight: getSpacing(4),
    outlineOffset: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.uniqueColors.brand,
    borderRadius: theme.borderRadius.button * 2,
  },
}))
