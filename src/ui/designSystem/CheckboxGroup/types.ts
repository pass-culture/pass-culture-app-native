import { ElementType } from 'react'

import { CheckboxProps } from 'ui/components/inputs/Checkbox/Checkbox'

type CheckboxGroupOptionSimple = Omit<
  CheckboxProps,
  'checked' | 'onChange' | 'hasError' | 'disabled' | 'variant' | 'asset'
> & {
  label: string
  value: string
  variant?: 'default'
  asset?: never
}

type CheckboxGroupOptionDetailed = Omit<
  CheckboxProps,
  'checked' | 'onChange' | 'hasError' | 'disabled' | 'variant'
> & {
  label: string
  value: string
  variant: 'detailed'
  asset?: CheckboxProps['asset']
}

export type CheckboxGroupOption = CheckboxGroupOptionSimple | CheckboxGroupOptionDetailed

export type CheckboxGroupProps = {
  label: string
  labelTag?: ElementType
  description?: string
  error?: string
  options: CheckboxGroupOption[]
  value: string[]
  onChange: (value: string[]) => void
  display?: 'vertical' | 'horizontal'
  variant?: 'default' | 'detailed'
  disabled?: boolean
}
