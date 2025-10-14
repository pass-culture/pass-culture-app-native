import React from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'

interface Props<TFieldValues extends FieldValues, TName> {
  name: TName
  control: Control<TFieldValues>
  label: string
  required?: boolean
}

export const CheckboxController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
}: Props<TFieldValues, TName>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <Checkbox isChecked={value} label={label} required={required} onPress={onChange} />
    )}
  />
)
