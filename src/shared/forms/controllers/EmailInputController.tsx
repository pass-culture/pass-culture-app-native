import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { EmailInput, EmailInputProps } from 'ui/components/inputs/EmailInput/EmailInput'
import { EmailInputWithSpellingHelp } from 'ui/components/inputs/EmailInputWithSpellingHelp/EmailInputWithSpellingHelp'

interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<EmailInputProps, 'onEmailChange' | 'email'> {
  name: TName
  control: Control<TFieldValues>
  withSpellingHelp?: boolean
  onSpellingHelpPress?: () => void
}

export const EmailInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  withSpellingHelp = true,
  onSpellingHelpPress,
  ...otherEmailInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  const Input = withSpellingHelp ? EmailInputWithSpellingHelp : EmailInput

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <Input
<<<<<<< HEAD
          ref={ref}
=======
          autoComplete="email"
>>>>>>> 05354227b75b ((PC-37497) add autocomplete props to email fields)
          email={value}
          onEmailChange={onChange}
          onBlur={onBlur}
          accessibilityHint={error?.message}
          onSpellingHelpPress={onSpellingHelpPress}
          errorMessage={error?.message}
          {...otherEmailInputProps}
        />
      )}
    />
  )
}
