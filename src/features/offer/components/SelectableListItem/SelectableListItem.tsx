import React, { CSSProperties, ReactNode } from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface ChildrenProps {
  isFocus: boolean
  isHover: boolean
  isSelected: boolean
}

interface SelectableListItemProps extends Omit<TouchableOpacityProps, 'children'> {
  isSelected?: boolean
  onSelect: VoidFunction
  render: (props: ChildrenProps) => ReactNode
}

export function SelectableListItem({
  isSelected,
  onSelect,
  render,
  ...props
}: Readonly<SelectableListItemProps>) {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { onMouseEnter, onMouseLeave, isHover } = useHandleHover()

  return (
    <Wrapper
      activeOpacity={0.5}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onSelect}
      isFocus={isFocus}
      isSelected={isSelected}
      // @ts-ignore It exists but not recognized by TypeScript
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}>
      <RadioWrapper isSelected={isSelected}>
        <RadioInner isSelected={isSelected} disabled={props.disabled} />
      </RadioWrapper>

      <InnerWrapper>{render({ isHover, isFocus, isSelected: isSelected ?? false })}</InnerWrapper>
    </Wrapper>
  )
}

const selectedStyles = (theme: DefaultTheme): CSSProperties => ({
  borderWidth: 2,
  borderColor: theme.colors.black,
  padding: getSpacing(4) - 1, // to avoid getting a jumping component
})

const unselectedStyles = (theme: DefaultTheme, disabled?: boolean): CSSProperties => ({
  borderWidth: 1,
  borderColor: disabled ? theme.colors.greyLight : theme.colors.greySemiDark,
  padding: getSpacing(4),
})

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
  isSelected?: boolean
}>(({ theme, isFocus, isSelected, disabled }) => {
  return {
    backgroundColor: disabled ? theme.colors.greyLight : theme.colors.white,
    borderRadius: getSpacing(2),
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    ...(isSelected ? selectedStyles(theme) : unselectedStyles(theme, disabled)),
    ...(!isSelected ? customFocusOutline({ color: theme.colors.black, isFocus }) : {}),
  }
})

const InnerWrapper = styled.View({
  flex: 1,
})

const RadioWrapper = styled.View<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: getSpacing(4),
  height: getSpacing(4),
  borderRadius: getSpacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: isSelected ? theme.colors.primary : theme.colors.greySemiDark,
  marginRight: getSpacing(4),
}))

const RadioInner = styled.View<{ isSelected?: boolean; disabled?: boolean }>(
  ({ theme, isSelected, disabled }) => ({
    width: disabled ? getSpacing(4) : getSpacing(2),
    height: disabled ? getSpacing(4) : getSpacing(2),
    backgroundColor: getRadioInnerBackgroundColor(theme, isSelected, disabled),
    borderRadius: getSpacing(4),
  })
)

function getRadioInnerBackgroundColor(theme: DefaultTheme, selected?: boolean, disabled?: boolean) {
  if (disabled) return theme.colors.greyMedium
  if (selected) return theme.colors.primary
  return 'transparent'
}
