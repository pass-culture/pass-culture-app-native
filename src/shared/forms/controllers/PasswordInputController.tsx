import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { PasswordInput, Props as PasswordInputProps } from 'ui/components/inputs/PasswordInput'

interface Props<TFieldValues extends FieldValues, TName> extends PasswordInputProps {
  name: TName
  control: Control<TFieldValues>
  passwordInputErrorId: string
}

export const PasswordInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  passwordInputErrorId,
  ...otherPasswordInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <PasswordInput
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          isRequiredField
          accessibilityDescribedBy={passwordInputErrorId}
          isError={error && value.length > 0}
          {...otherPasswordInputProps}
        />
      )}
    />
  )
}
