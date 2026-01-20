import React from 'react'
import styled from 'styled-components'

import { getSpacingString } from 'ui/theme'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

type QuickAccessProps = {
  href: string
  title: string
}

export const QuickAccess = ({ href, title }: QuickAccessProps) => (
  <StyledA href={href}>{title}</StyledA>
)

const StyledA: React.FC<{ href: string; children: string }> = displayOnFocus(
  styled.a(({ theme }) => ({
    ...theme.designSystem.typography.button,
    color: theme.designSystem.color.border.brandPrimary,
    backgroundColor: theme.designSystem.color.background.default,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    '&:focus': {
      height: `${getSpacingString(11)} !important`,
      margin: theme.designSystem.size.spacing.s,
      paddingLeft: theme.designSystem.size.spacing.l,
      paddingRight: theme.designSystem.size.spacing.l,
      outlineOffset: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.designSystem.color.border.brandPrimary,
      borderRadius: theme.designSystem.size.borderRadius.pill,
    },
  }))
)
