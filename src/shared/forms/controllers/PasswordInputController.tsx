import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import {
  PASSWORD_SECURITY_RULES_ACCESSIBILITY_LABEL,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { PasswordInput, Props as PasswordInputProps } from 'ui/components/inputs/PasswordInput'

interface Props<TFieldValues extends FieldValues, TName> extends PasswordInputProps {
  name: TName
  control: Control<TFieldValues>
  withSecurityRules?: boolean
  securityRulesAlwaysVisible?: boolean
}

export const PasswordInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  withSecurityRules = false,
  securityRulesAlwaysVisible = false,
  ...otherPasswordInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  const passwordInputErrorId = uuidv4()

  const securityRulesAccessibilityLabel = withSecurityRules
    ? PASSWORD_SECURITY_RULES_ACCESSIBILITY_LABEL
    : undefined

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
        const computedAccessibilityHint = getComputedAccessibilityLabel(
          securityRulesAccessibilityLabel,
          error?.message
        )

        return (
          <React.Fragment>
            <PasswordInput
              ref={ref}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              accessibilityHint={computedAccessibilityHint}
              errorMessage={error?.message}
              {...otherPasswordInputProps}
            />
            {withSecurityRules ? (
              <PasswordSecurityRules
                password={value}
                visible={securityRulesAlwaysVisible ? true : value.length > 0}
                nativeID={passwordInputErrorId}
              />
            ) : null}
          </React.Fragment>
        )
      }}
    />
  )
}
