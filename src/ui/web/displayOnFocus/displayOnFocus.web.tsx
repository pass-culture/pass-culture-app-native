import { ElementType } from 'react'
import styled from 'styled-components'

import { hiddenAccessibleStyle } from 'ui/components/HiddenAccessibleText'

export const displayOnFocus = (Component: ElementType) => {
  return styled(Component)(({ theme }) => ({
    zIndex: theme.zIndex.floatingButton,
    position: 'absolute',

    ...hiddenAccessibleStyle,
    '&:focus': {
      clipPath: 'none',
      width: 'inherit',
      height: 'inherit',
    },
  }))
}
