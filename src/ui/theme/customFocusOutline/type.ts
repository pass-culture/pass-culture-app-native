import { DefaultTheme } from 'styled-components/native'

import { ColorsType } from 'theme/types'

export type CustomFocusOutlineProps = {
  color?: ColorsType
  width?: number
  isFocus?: boolean
  noOffset?: boolean
}

export type TouchableFocusOutlineProps = {
  theme: DefaultTheme
  isFocus?: boolean
}
