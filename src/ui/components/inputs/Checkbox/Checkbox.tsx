import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { getSpacing, Typo } from 'ui/theme'

type IsCheckedProps = {
  isChecked: boolean
}

type Props = IsCheckedProps & {
  label: string
  onPress: () => void
  children?: never
}

export const Checkbox: FunctionComponent<Props> = ({ label, isChecked, onPress }) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const accessibilityState = useMemo(() => ({ checked: isChecked }), [isChecked])

  useSpaceBarAction(isFocus ? onPress : undefined)

  return (
    <CheckboxContainer
      accessibilityRole={AccessibilityRole.CHECKBOX}
      accessibilityLabel={label}
      accessibilityState={accessibilityState}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}>
      <Box isChecked={isChecked}>{!!isChecked && <CheckboxMark />}</Box>
      <Label>{label}</Label>
    </CheckboxContainer>
  )
}

const CheckboxContainer = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
})

const Box = styled.View<IsCheckedProps>(({ isChecked, theme }) => ({
  width: getSpacing(6),
  height: getSpacing(6),
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.borderRadius.checkbox,
  border: 2,
  borderColor: theme.colors.greyDark,
  backgroundColor: isChecked ? theme.colors.greyDark : theme.colors.white,
}))

const Label = styled(Typo.Body)({
  alignSelf: 'center',
  paddingLeft: getSpacing(4),
  flex: 1,
})
