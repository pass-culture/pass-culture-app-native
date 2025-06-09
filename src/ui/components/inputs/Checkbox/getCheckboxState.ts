import { CheckboxState } from 'ui/components/inputs/Checkbox/types'

export const getCheckboxState = (
  isChecked: boolean,
  indeterminate?: boolean,
  hasError?: boolean,
  disabled?: boolean
): CheckboxState => {
  if (disabled) return 'disabled'
  if (hasError) return 'error'
  if (indeterminate) return 'indeterminate'
  if (isChecked) return 'checked'
  return 'default'
}
