import React, { PropsWithChildren, ReactElement } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { getPasswordRulesAccessibilityLabel } from 'ui/designSystem/PasswordInput/helpers'
import { PasswordInput } from 'ui/designSystem/PasswordInput/PasswordInput'

interface Props<TFieldValues extends FieldValues, TName>
  extends Omit<React.ComponentProps<typeof PasswordInput>, 'value' | 'onChangeText'> {
  name: TName
  control: Control<TFieldValues>
  displayValidation?: boolean
}

export const PasswordInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  displayValidation = false,
  ...otherPasswordInputProps
}: PropsWithChildren<Props<TFieldValues, TName>>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const securityRulesAccessibilityLabel = displayValidation
          ? getPasswordRulesAccessibilityLabel(value)
          : undefined

        const computedAccessibilityHint = getComputedAccessibilityLabel(
          securityRulesAccessibilityLabel,
          error?.message ? `erreur\u00a0 ${error.message}` : undefined
        )

        return (
          <PasswordInput
            {...otherPasswordInputProps}
            value={value}
            onChangeText={onChange}
            errorMessage={displayValidation ? undefined : error?.message}
            displayValidation={displayValidation}
            accessibilityHint={computedAccessibilityHint}
          />
        )
      }}
    />
  )
}
