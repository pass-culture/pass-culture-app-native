import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { PasswordRule } from 'ui/components/inputs/rules/PasswordRule'
import { getSpacing } from 'ui/theme'

type Props = {
  password: string
  visible?: boolean
  nativeID?: string
}

export const PASSWORD_MIN_LENGTH = 12
export const CAPITAL_REGEX = /[A-Z]+/
export const LOWERCASE_REGEX = /[a-z]+/
export const NUMBER_REGEX = /[0-9]+/
export const SPECIAL_CHARACTER_REGEX = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

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
      <HiddenAccessibleText nativeID={nativeID} displayBlock>
        Le mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre et
        un caractère spécial
      </HiddenAccessibleText>
      <RulesContainer
        isVisible={visible}
        accessibilityRole={AccessibilityRole.STATUS}
        aria-atomic={false}>
        <PasswordRule title="12 Caractères" isValidated={isLongEnough(password)} />
        <PasswordRule title="1 Majuscule" isValidated={containsCapital(password)} />
        <PasswordRule title="1 Minuscule" isValidated={containsLowercase(password)} />
        <PasswordRule title="1 Chiffre" isValidated={containsNumber(password)} />
        <PasswordRule
          title="1 Caractère spécial (!@#$%^&*...)"
          isValidated={containsSpecialCharacter(password)}
        />
      </RulesContainer>
    </React.Fragment>
  )
}

const RulesContainer = styled(View)<{ isVisible?: boolean }>(({ isVisible, theme }) => ({
  alignItems: 'flex-start',
  width: '100%',
  height: isVisible ? undefined : '0',
  overflow: isVisible ? undefined : 'hidden',
  maxWidth: theme.forms.maxWidth,
  paddingTop: isVisible ? getSpacing(2) : 0,
}))
