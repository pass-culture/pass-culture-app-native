import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { PasswordSecurityRules } from 'features/auth/components/PasswordSecurityRules'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput, Props as PasswordInputProps } from 'ui/components/inputs/PasswordInput'
import { getSpacing } from 'ui/theme'

const passwordInputErrorId = uuidv4()

interface Props<TFieldValues extends FieldValues, TName> extends PasswordInputProps {
  name: TName
  control: Control<TFieldValues>
  withSecurityRules?: boolean
  securityRulesAlwaysVisible?: boolean
}

export const PasswordInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  withSecurityRules = false,
  securityRulesAlwaysVisible = false,
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
          {withSecurityRules ? (
            <PasswordSecurityRules
              password={value}
              visible={securityRulesAlwaysVisible ? true : value.length > 0}
              nativeID={passwordInputErrorId}
            />
          ) : (
            <InputError
              visible={!!error && value.length > 0}
              messageId={error?.message}
              numberOfSpacesTop={getSpacing(0.5)}
              relatedInputId={passwordInputErrorId}
            />
          )}
        </React.Fragment>
      )}
    />
  )
}
