import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { EmailInput, Props as EmailInputProps } from 'ui/components/inputs/EmailInput/EmailInput'

interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<EmailInputProps, 'onEmailChange' | 'email'> {
  name: TName
  control: Control<TFieldValues>
  emailInputErrorId: string
}

export const EmailInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  emailInputErrorId,
  ...otherEmailInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <EmailInput
          email={value}
          onEmailChange={onChange}
          onBlur={onBlur}
          accessibilityDescribedBy={emailInputErrorId}
          {...otherEmailInputProps}
        />
      )}
    />
  )
}
