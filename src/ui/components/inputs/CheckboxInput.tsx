import React from 'react'
import styled from 'styled-components/native'

import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { getSpacing } from 'ui/theme'

type CustomCheckboxProps = {
  isChecked: boolean
  setIsChecked?: (b: boolean) => void
  accessible?: boolean
}

export function CheckboxInput({
  isChecked,
  setIsChecked,
  accessible = true,
}: CustomCheckboxProps): JSX.Element {
  function setToggleCheckbox() {
    if (setIsChecked) {
      setIsChecked(!isChecked)
    }
  }

  return (
    <StyledCheckboxInput
      checked={isChecked}
      onPress={setToggleCheckbox}
      testID="checkbox"
      disabled={!accessible}>
      {!!isChecked && <CheckboxMark testID={'checkbox-mark'} />}
    </StyledCheckboxInput>
  )
}

const StyledCheckboxInput = styled.TouchableOpacity<{ checked: boolean }>(({ checked, theme }) => ({
  width: getSpacing(6),
  height: getSpacing(6),
  borderRadius: theme.borderRadius.checkbox,
  border: 2,
  borderColor: theme.colors.greyDark,
  backgroundColor: checked ? theme.colors.greyDark : theme.colors.white,
  paddingLeft: checked ? getSpacing(0.8) : 0,
  paddingTop: checked ? getSpacing(1.2) : 0,
}))
