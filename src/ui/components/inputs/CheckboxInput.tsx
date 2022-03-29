import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { getSpacing } from 'ui/theme'

type CustomCheckboxProps = {
  isChecked: boolean
}

export function CheckboxInput({ isChecked }: CustomCheckboxProps): JSX.Element {
  return (
    <StyledCheckboxInput checked={isChecked} testID="checkbox">
      {!!isChecked && <CheckboxMark testID={'checkbox-mark'} />}
    </StyledCheckboxInput>
  )
}

const StyledCheckboxInput = styled(View)<{ checked: boolean }>(({ checked, theme }) => ({
  width: getSpacing(6),
  height: getSpacing(6),
  borderRadius: theme.borderRadius.checkbox,
  border: 2,
  borderColor: theme.colors.greyDark,
  backgroundColor: checked ? theme.colors.greyDark : theme.colors.white,
  paddingLeft: checked ? getSpacing(0.8) : 0,
  paddingTop: checked ? getSpacing(1.2) : 0,
}))
