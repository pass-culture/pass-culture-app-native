import { ComponentType } from 'react'

import { styledButton } from 'ui/components/buttons/styledButton'
import { hiddenAccessibleStyle } from 'ui/components/HiddenAccessibleText'

export const displayOnFocus = <Props,>(Component: ComponentType<Props>) => {
  return styledButton(Component)(({ theme }) => ({
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
