/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import styled from 'styled-components/native'

import { CheckBoxMark } from 'ui/svg/icons/CheckBoxTMark'
import { ColorsEnum, getSpacing } from 'ui/theme'

export type CustomCheckBoxProps = {
  isChecked: boolean
  setIsChecked: (b: boolean) => void
}

export function CheckBoxInput({ isChecked, setIsChecked }: CustomCheckBoxProps): JSX.Element {

  function setToggleCheckBox() {
    setIsChecked(!isChecked)
  }

  return (
    <StyledCheckBoxInput checked={isChecked} onPress={setToggleCheckBox}>
      {isChecked && <CheckBoxMark />}
    </StyledCheckBoxInput>
  )
}

const StyledCheckBoxInput = styled.TouchableOpacity<{ checked: boolean }>((props) => ({
  width: getSpacing(6),
  height: getSpacing(6),
  borderRadius: getSpacing(1),
  border: 2,
  borderColor: ColorsEnum.GREY_DARK,
  backgroundColor: props.checked ? ColorsEnum.GREY_DARK : ColorsEnum.WHITE,
  paddingLeft: props.checked ? getSpacing(0.8) : 0,
  paddingTop: props.checked ? getSpacing(1.2) : 0,
}))
