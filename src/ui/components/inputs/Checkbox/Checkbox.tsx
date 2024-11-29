import React, { FunctionComponent, useCallback } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { getSpacing, TypoDS } from 'ui/theme'

type IsCheckedProps = {
  isChecked: boolean
}

type Props = IsCheckedProps & {
  label?: string
  LabelComponent?: FunctionComponent
  onPress: (isChecked: boolean) => void
  required?: boolean
  style?: StyleProp<ViewStyle>
}

export const Checkbox: FunctionComponent<Props> = ({
  label,
  isChecked,
  required,
  onPress,
  LabelComponent = StyledBody,
  style,
}) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const onToggle = useCallback(() => {
    onPress(!isChecked)
  }, [isChecked, onPress])

  useSpaceBarAction(isFocus ? onToggle : undefined)

  return (
    <CheckboxContainer
      {...accessibleCheckboxProps({ checked: isChecked, label, required })}
      onPress={onToggle}
      onFocus={onFocus}
      style={style}
      onBlur={onBlur}>
      <Box isChecked={isChecked}>{isChecked ? <CheckboxMark /> : null}</Box>
      {label ? (
        <LabelComponent>
          {label}
          {required ? '*' : null}
        </LabelComponent>
      ) : null}
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
  border: theme.checkbox.border.size,
  borderColor: isChecked
    ? theme.checkbox.border.color.selected
    : theme.checkbox.border.color.default,
  backgroundColor: isChecked
    ? theme.checkbox.backgroundColor.selected
    : theme.checkbox.backgroundColor.default,
}))

const StyledBody = styled(TypoDS.Body)({
  alignSelf: 'center',
  paddingLeft: getSpacing(4),
  flex: 1,
})
