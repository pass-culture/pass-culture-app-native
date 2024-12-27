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
  accessibilityId: string
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
  accessibilityId,
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
            textContentType="none"
            accessibilityDescribedBy={accessibilityId}
            keyboardType="numeric"
            autoComplete="off"
            autoCapitalize="none"
            {...textInputProps}
          />
          <InputError
            visible={!!error}
            messageId={error?.message}
            relatedInputId={accessibilityId}
            numberOfSpacesTop={getSpacing(0.5)}
          />
        </React.Fragment>
      )}
    />
  )
}
