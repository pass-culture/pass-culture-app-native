import {
  RadioButtonGroupNavigation,
  RadioButtonGroupNavigationParams,
} from 'ui/designSystem/RadioButtonGroup/types'

export const useRadioButtonGroupNavigation = (
  _params: RadioButtonGroupNavigationParams
): RadioButtonGroupNavigation => ({
  getRadioProps: (_key: string): { id?: string; tabIndex?: 0 | -1 } => ({}),
  onScrollToIndexFailed: undefined,
})
