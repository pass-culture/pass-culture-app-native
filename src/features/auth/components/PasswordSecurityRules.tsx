import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { View, Platform, AccessibilityRole } from 'react-native'
import styled from 'styled-components/native'

import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { PasswordRule } from 'ui/components/inputs/rules/PasswordRule'
import { getSpacing } from 'ui/theme'

type Props = {
  password: string
  visible?: boolean
  nativeID?: string
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

export function isLongEnough(password: string): boolean {
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

export const PasswordSecurityRules: FunctionComponent<Props> = ({
  password,
  visible = true,
  nativeID,
}) => {
  return (
    <React.Fragment>
      <HiddenAccessibleText nativeID={nativeID}>
        {t`Le mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre et un caractère spécial`}
      </HiddenAccessibleText>
      <RulesContainer isVisible={visible}>
        {!!visible && (
          <React.Fragment>
            <PasswordRule title={t`12 Caractères`} isValidated={isLongEnough(password)} />
            <PasswordRule title={t`1 Majuscule`} isValidated={containsCapital(password)} />
            <PasswordRule title={t`1 Minuscule`} isValidated={containsLowercase(password)} />
            <PasswordRule title={t`1 Chiffre`} isValidated={containsNumber(password)} />
            <PasswordRule
              title={t`1 Caractère spécial (!@#$%^&*...)`}
              isValidated={containsSpecialCharacter(password)}
            />
          </React.Fragment>
        )}
      </RulesContainer>
    </React.Fragment>
  )
}

const RulesContainer = styled(View).attrs({
  accessibilityRole: Platform.OS === 'web' ? ('status' as AccessibilityRole) : undefined,
})<{ isVisible?: boolean }>(({ theme, isVisible }) => ({
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  paddingTop: isVisible ? getSpacing(2) : 0,
}))
