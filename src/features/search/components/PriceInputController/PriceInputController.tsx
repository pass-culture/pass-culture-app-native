import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { getSpacing } from 'ui/theme/spacing'

interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChangeText'> {
  name: TName
  control: Control<TFieldValues>
  label: string
  placeholder?: string
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
  placeholder,
  rightLabel,
  isDisabled,
  ...textInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <React.Fragment>
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            label={label}
            placeholder={placeholder}
            rightLabel={rightLabel}
            disabled={isDisabled}
            isError={!!error && value.length > 0}
            accessibilityHint={error?.message}
            keyboardType="numeric"
            autoCapitalize="none"
            autoComplete="off" // Keep autocomplete="off" to prevent incorrect suggestions.
            textContentType="none" // Keep textContentType="none" to prevent incorrect suggestions.
            {...textInputProps}
          />
          <InputError
            visible={!!error}
            messageId={error?.message}
            numberOfSpacesTop={getSpacing(0.5)}
          />
        </React.Fragment>
      )}
    />
  )
}
