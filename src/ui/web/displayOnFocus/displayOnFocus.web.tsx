import { ElementType } from 'react'
import styled from 'styled-components'

export const displayOnFocus = (Component: ElementType) => {
  return styled(Component)(({ theme }) => ({
    zIndex: theme.zIndex.floatingButton,
    position: 'absolute',

    overflow: 'hidden',
    clipPath: 'inset(50%)',
    width: '1px',
    height: '1px',
    '&:focus': {
      clipPath: 'none',
      width: 'inherit',
      height: 'inherit',
    },
  }))
}
