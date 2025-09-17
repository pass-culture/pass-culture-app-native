import { CheckboxState } from 'ui/designSystem/Checkbox/types'

export const getCheckboxState = (
  isChecked: boolean,
  indeterminate?: boolean,
  hasError?: boolean,
  disabled?: boolean
): CheckboxState[] => {
  const states: CheckboxState[] = []

  if (disabled) states.push('disabled')
  if (hasError) states.push('error')
  if (indeterminate) states.push('indeterminate')
  else if (isChecked) states.push('checked')
  if (states.length === 0) states.push('default')
  return states
}
