import React from 'react'
import styled from 'styled-components'

import { getSpacing, getSpacingString } from 'ui/theme'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

type QuickAccessProps = {
  href: string
  title: string
}

export const QuickAccess = ({ href, title }: QuickAccessProps) => (
  <StyledA href={href}>{title}</StyledA>
)

const StyledA = displayOnFocus(
  styled.a(({ theme }) => ({
    ...theme.typography.buttonText,
    color: theme.uniqueColors.brand,
    backgroundColor: theme.colors.white,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    '&:focus': {
      height: `${getSpacingString(11)}\u00a0!important`,
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
)
