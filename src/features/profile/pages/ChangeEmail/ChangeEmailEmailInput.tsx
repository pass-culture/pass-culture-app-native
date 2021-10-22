import { t } from '@lingui/macro'
import React, { Fragment } from 'react'

import { accessibilityAndTestId } from 'tests/utils'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  email: string
  onEmailChange: (email: string) => void
}

export const ChangeEmailEmailInput = ({ email, onEmailChange }: Props) => (
  <Fragment>
    <Typo.Body>{t`Nouvel e-mail`}</Typo.Body>
    <Spacer.Column numberOfSpaces={2} />
    <TextInput
      autoCapitalize="none"
      keyboardType="email-address"
      onChangeText={onEmailChange}
      placeholder={t`tonadresse@email.com`}
      textContentType="emailAddress"
      value={email}
      {...accessibilityAndTestId("Entrée pour l'email")}
    />
  </Fragment>
)
