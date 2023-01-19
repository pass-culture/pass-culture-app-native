import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { EmailInput, EmailInputProps } from 'ui/components/inputs/EmailInput/EmailInput'
import { EmailInputWithSpellingHelp } from 'ui/components/inputs/EmailInputWithSpellingHelp/EmailInputWithSpellingHelp'
import { InputError } from 'ui/components/inputs/InputError'

const emailInputErrorId = uuidv4()
interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<EmailInputProps, 'onEmailChange' | 'email'> {
  name: TName
  control: Control<TFieldValues>
  withSpellingHelp?: boolean
  onSpellingHelpPress?: () => void
}

export const EmailInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  withSpellingHelp,
  onSpellingHelpPress,
  ...otherEmailInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  const Input = withSpellingHelp ? EmailInputWithSpellingHelp : EmailInput

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <React.Fragment>
          <Input
            email={value}
            onEmailChange={onChange}
            onBlur={onBlur}
            accessibilityDescribedBy={emailInputErrorId}
            onSpellingHelpPress={onSpellingHelpPress}
            {...otherEmailInputProps}
          />
          <InputError
            visible={!!error}
            messageId={error?.message}
            numberOfSpacesTop={2}
            relatedInputId={emailInputErrorId}
          />
        </React.Fragment>
      )}
    />
  )
}
