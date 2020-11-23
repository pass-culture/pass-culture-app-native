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

export function isPasswordCorrect(password: string) {
  return (
    isLongEnough(password) &&
    containsCapital(password) &&
    containsLowercase(password) &&
    containsNumber(password) &&
    containsSpecialCharacter(password)
  )
}

function isLongEnough(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH
}

function containsCapital(password: string): boolean {
  return password.match(CAPITAL_REGEX) ? true : false
}

function containsLowercase(password: string): boolean {
  return password.match(LOWERCASE_REGEX) ? true : false
}

function containsNumber(password: string): boolean {
  return password.match(NUMBER_REGEX) ? true : false
}

function containsSpecialCharacter(password: string): boolean {
  return password.match(SPECIAL_CHARACTER_REGEX) ? true : false
}

export const PasswordSecurityRules: FunctionComponent<Props> = ({ password }) => {
  return (
    <RulesContainer>
      <PasswordRule title={_(t`12 Caractères`)} isValidated={isLongEnough(password)} />
      <PasswordRule title={_(t`1 Majuscule`)} isValidated={containsCapital(password)} />
      <PasswordRule title={_(t`1 Minuscule`)} isValidated={containsLowercase(password)} />
      <PasswordRule title={_(t`1 Chiffre`)} isValidated={containsNumber(password)} />
      <PasswordRule
        title={_(t`1 Caractère spécial (!@#$%^&*...)`)}
        isValidated={containsSpecialCharacter(password)}
      />
    </RulesContainer>
  )
}

const RulesContainer = styled.View({
  alignItems: 'flex-start',
  paddingTop: getSpacing(1),
})
