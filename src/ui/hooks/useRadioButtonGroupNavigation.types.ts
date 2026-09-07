import { RefObject } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'

import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

export type RadioButtonGroupNavigationParams = {
  containerRef: RefObject<View | null>
  listRef: RefObject<Pick<
    FlatList<RadioButtonGroupOption>,
    'scrollToIndex' | 'scrollToOffset'
  > | null>
  options: RadioButtonGroupOption[]
  value: string
  disabled: boolean
  onChange: (value: string) => void
  id: string
}

export type RadioButtonGroupNavigation = {
  getRadioProps: (key: string) => { id?: string; tabIndex?: 0 | -1 }
  onScrollToIndexFailed?: FlatListProps<RadioButtonGroupOption>['onScrollToIndexFailed']
}
