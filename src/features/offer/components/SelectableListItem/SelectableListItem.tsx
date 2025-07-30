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
  contentDirection?: 'row' | 'column'
}

export function SelectableListItem({
  isSelected,
  onSelect,
  render,
  contentDirection = 'row',
  ...props
}: SelectableListItemProps) {
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
      contentDirection={contentDirection}
      // @ts-ignore It exists but not recognized by TypeScript
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}>
      <RadioWrapper isSelected={isSelected}>
        <RadioInner isSelected={isSelected} disabled={props.disabled} />
      </RadioWrapper>

      <InnerWrapper contentDirection={contentDirection}>
        {render({ isHover, isFocus, isSelected: isSelected ?? false })}
      </InnerWrapper>
    </Wrapper>
  )
}

const selectedStyles = (theme: DefaultTheme): CSSProperties => ({
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.default,
  padding: getSpacing(4) - 1, // to avoid getting a jumping component
})

const unselectedStyles = (theme: DefaultTheme, disabled?: boolean): CSSProperties => ({
  borderWidth: 1,
  borderColor: disabled
    ? theme.designSystem.color.border.disabled
    : theme.designSystem.color.border.subtle,
  padding: theme.designSystem.size.spacing.l,
})

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
  isSelected?: boolean
  contentDirection?: 'row' | 'column'
}>(({ theme, isFocus, isSelected, disabled, contentDirection }) => {
  return {
    backgroundColor: disabled
      ? theme.designSystem.color.background.disabled
      : theme.designSystem.color.background.default,
    borderRadius: theme.designSystem.size.borderRadius.m,
    borderStyle: 'solid',
    flexDirection: contentDirection,
    alignItems: contentDirection === 'row' ? 'center' : 'flex-start',
    flexGrow: 1,
    ...(isSelected ? selectedStyles(theme) : unselectedStyles(theme, disabled)),
    ...(isSelected ? {} : customFocusOutline({ isFocus })),
  }
})

const InnerWrapper = styled.View<{
  contentDirection?: 'row' | 'column'
}>(({ contentDirection }) => ({
  flexGrow: 1,
  flexShrink: contentDirection === 'row' ? 1 : undefined,
  width: contentDirection === 'column' ? '100%' : undefined,
}))

const RadioWrapper = styled.View<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: theme.designSystem.size.spacing.l,
  height: theme.designSystem.size.spacing.l,
  borderRadius: theme.designSystem.size.borderRadius.m,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: isSelected
    ? theme.designSystem.color.border.brandPrimary
    : theme.designSystem.color.border.default,
  marginRight: theme.designSystem.size.spacing.l,
}))

const RadioInner = styled.View<{ isSelected?: boolean; disabled?: boolean }>(
  ({ theme, isSelected, disabled }) => ({
    width: disabled ? theme.designSystem.size.spacing.l : theme.designSystem.size.spacing.s,
    height: disabled ? theme.designSystem.size.spacing.l : theme.designSystem.size.spacing.s,
    backgroundColor: getRadioInnerBackgroundColor(theme, isSelected, disabled),
    borderRadius: theme.designSystem.size.borderRadius.l,
  })
)

function getRadioInnerBackgroundColor(theme: DefaultTheme, selected?: boolean, disabled?: boolean) {
  if (disabled) return theme.designSystem.color.background.disabled
  if (selected) return theme.designSystem.color.background.brandPrimary
  return 'transparent'
}
