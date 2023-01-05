import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput, Props as PasswordInputProps } from 'ui/components/inputs/PasswordInput'
import { getSpacing } from 'ui/theme'

const passwordInputErrorId = uuidv4()

interface Props<TFieldValues extends FieldValues, TName> extends PasswordInputProps {
  name: TName
  control: Control<TFieldValues>
}

export const PasswordInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  ...otherPasswordInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <React.Fragment>
          <PasswordInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            isRequiredField
            accessibilityDescribedBy={passwordInputErrorId}
            isError={error && value.length > 0}
            {...otherPasswordInputProps}
          />
          <InputError
            visible={!!error}
            messageId={error?.message}
            numberOfSpacesTop={getSpacing(0.5)}
            relatedInputId={passwordInputErrorId}
          />
        </React.Fragment>
      )}
    />
  )
}
