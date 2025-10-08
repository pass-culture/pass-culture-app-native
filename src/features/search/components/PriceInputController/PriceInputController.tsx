import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { InputText } from 'ui/designSystem/InputText/InputText'

interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<React.ComponentProps<typeof InputText>, 'value' | 'onChangeText'> {
  name: TName
  control: Control<TFieldValues>
  label: string
  rightLabel?: string
  isDisabled?: boolean
}

export const PriceInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  isDisabled,
  testID,
  ...textInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <InputText
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          label={label}
          description={description}
          disabled={isDisabled}
          accessibilityHint={error?.message}
          keyboardType="numeric"
          autoCapitalize="none"
          autoComplete="off" // Keep autocomplete="off" to prevent incorrect suggestions.
          textContentType="none" // Keep textContentType="none" to prevent incorrect suggestions.
          errorMessage={error?.message}
          testID={testID ?? 'Entrée pour un prix'}
          {...textInputProps}
        />
      )}
    />
  )
}
