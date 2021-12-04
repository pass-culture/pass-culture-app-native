import React from 'react'
import styled from 'styled-components/native'

import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

type CustomCheckboxProps = {
  isChecked: boolean
  setIsChecked?: (b: boolean) => void
}

export function CheckboxInput({ isChecked, setIsChecked }: CustomCheckboxProps): JSX.Element {
  function setToggleCheckbox() {
    if (setIsChecked) {
      setIsChecked(!isChecked)
    }
  }

  return (
    <StyledCheckboxInput checked={isChecked} onPress={setToggleCheckbox} testID="checkbox">
      {!!isChecked && <CheckboxMark testID={'checkbox-mark'} />}
    </StyledCheckboxInput>
  )
}

const StyledCheckboxInput = styled.TouchableOpacity<{ checked: boolean }>((props) => ({
  width: getSpacing(6),
  height: getSpacing(6),
  borderRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
  border: 2,
  borderColor: ColorsEnum.GREY_DARK,
  backgroundColor: props.checked ? ColorsEnum.GREY_DARK : ColorsEnum.WHITE,
  paddingLeft: props.checked ? getSpacing(0.8) : 0,
  paddingTop: props.checked ? getSpacing(1.2) : 0,
}))
