import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { PasswordRule } from 'ui/components/inputs/rules/PasswordRule'
import { Spacer, getSpacing } from 'ui/theme'

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

function isLongEnough(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH
}

function containsCapital(password: string): boolean {
  return CAPITAL_REGEX.test(password)
}

function containsLowercase(password: string): boolean {
  return LOWERCASE_REGEX.test(password)
}

function containsNumber(password: string): boolean {
  return NUMBER_REGEX.test(password)
}

function containsSpecialCharacter(password: string): boolean {
  return SPECIAL_CHARACTER_REGEX.test(password)
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
      {visible ? (
        <RulesContainer
          isVisible={visible}
          accessibilityRole={AccessibilityRole.STATUS}
          accessibilityAtomic={false}>
          <PasswordRule title="12 caractères" isValidated={isLongEnough(password)} />
          <Spacer.Column numberOfSpaces={1} />
          <PasswordRule title="1 majuscule" isValidated={containsCapital(password)} />
          <Spacer.Column numberOfSpaces={1} />
          <PasswordRule title="1 minuscule" isValidated={containsLowercase(password)} />
          <Spacer.Column numberOfSpaces={1} />
          <PasswordRule title="1 chiffre" isValidated={containsNumber(password)} />
          <Spacer.Column numberOfSpaces={1} />
          <PasswordRule
            title="1 caractère spécial (!@#$%^&*...)"
            isValidated={containsSpecialCharacter(password)}
          />
        </RulesContainer>
      ) : null}
    </React.Fragment>
  )
}

const RulesContainer = styled.View<{ isVisible?: boolean }>(({ theme }) => ({
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  paddingTop: getSpacing(2),
}))
