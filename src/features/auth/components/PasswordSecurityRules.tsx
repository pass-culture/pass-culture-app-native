import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PasswordRule } from 'ui/components/inputs/rules/PasswordRule'
import { getSpacing } from 'ui/theme'

type Props = {
  password: string
}

const PASSWORD_MIN_LENGTH = 12
const CAPITAL_REGEX = /[A-Z]+/
const LOWERCASE_REGEX = /[a-z]+/
const NUMBER_REGEX = /[0-9]+/
const SPECIAL_CHARACTER_REGEX = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

export const PasswordSecurityRules: FunctionComponent<Props> = ({ password }) => {
  return (
    <RulesContainer>
      <PasswordRule
        title={_(t`12 Caractères`)}
        isValidated={password.length >= PASSWORD_MIN_LENGTH}
      />
      <PasswordRule
        title={_(t`1 Majuscule`)}
        isValidated={password.match(CAPITAL_REGEX) ? true : false}
      />
      <PasswordRule
        title={_(t`1 Minuscule`)}
        isValidated={password.match(LOWERCASE_REGEX) ? true : false}
      />
      <PasswordRule
        title={_(t`1 Chiffre`)}
        isValidated={password.match(NUMBER_REGEX) ? true : false}
      />
      <PasswordRule
        title={_(t`1 Caractère spécial (!@#$%^&*...)`)}
        isValidated={password.match(SPECIAL_CHARACTER_REGEX) ? true : false}
      />
    </RulesContainer>
  )
}

const RulesContainer = styled.View({
  alignItems: 'flex-start',
  paddingTop: getSpacing(1),
})
