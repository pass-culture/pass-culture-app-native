import React, { FunctionComponent, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { CheckboxAsset } from 'ui/components/inputs/Checkbox/CheckboxAsset'
import { getCheckboxColors } from 'ui/components/inputs/Checkbox/getCheckboxColors'
import { getCheckboxState } from 'ui/components/inputs/Checkbox/getCheckboxState'
import {
  CheckboxAssetProps,
  CheckboxDisplay,
  CheckboxState,
  CheckboxVariant,
} from 'ui/components/inputs/Checkbox/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { CheckboxMarkChecked } from 'ui/svg/icons/CheckboxMarkChecked'
import { CheckboxMarkIndeterminate } from 'ui/svg/icons/CheckboxMarkIndeterminate'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type CheckboxBaseCheckedOnly = {
  isChecked: boolean
  indeterminate?: false
}

type CheckboxBaseIndeterminateOnly = {
  isChecked: false
  indeterminate: true
}

type CheckboxBase = {
  label: string
  onPress: (isChecked: boolean) => void
  required?: boolean
  hasError?: boolean
  disabled?: boolean
} & (CheckboxBaseCheckedOnly | CheckboxBaseIndeterminateOnly)

type Props = CheckboxBase &
  (
    | {
        asset?: never
        collapsed?: never
        description?: never
        display?: CheckboxDisplay
        variant?: 'default'
      }
    | {
        asset?: CheckboxAssetProps
        collapsed?: never
        description?: string
        display?: CheckboxDisplay
        variant?: 'detailed'
      }
    | {
        asset?: CheckboxAssetProps
        collapsed: React.ReactNode
        description?: string
        display?: Extract<CheckboxDisplay, 'fill'>
        variant?: 'detailed'
      }
  )

export const Checkbox: FunctionComponent<Props> = ({
  asset,
  collapsed,
  description,
  disabled,
  display,
  hasError,
  indeterminate,
  isChecked,
  label,
  onPress,
  required,
  variant = 'default',
}) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  const { designSystem, checkbox } = useTheme()

  const onToggle = useCallback(() => {
    onPress(!isChecked)
  }, [isChecked, onPress])

  useSpaceBarAction(focusProps.isFocus ? onToggle : undefined)

  const effectiveDisplay: CheckboxDisplay = display ?? (variant === 'detailed' ? 'fill' : 'hug')

  const state = getCheckboxState(isChecked, indeterminate, hasError, disabled)
  const isDisabled = state.includes('disabled')
  const isCheckedState = state.includes('checked')
  const isIndeterminate = state.includes('indeterminate')

  const colorMark = disabled ? designSystem.color.icon.disabled : designSystem.color.icon.inverted
  const checkboxMarkSize = checkbox.size / 1.5 // Parent padding doesn't have effect on CheckboxMarkIndeterminate

  return (
    <CheckboxContainer
      {...accessibleCheckboxProps({ checked: isChecked, label, required })}
      state={state}
      variant={variant}
      display={effectiveDisplay}
      collapsed={collapsed}
      onPress={onToggle}
      {...focusProps}
      {...hoverProps}>
      <ContentContainer>
        <LeftBox state={state} variant={variant}>
          {isIndeterminate ? (
            <CheckboxMarkIndeterminate
              color={colorMark}
              width={checkboxMarkSize}
              height={checkboxMarkSize}
            />
          ) : isCheckedState ? (
            <CheckboxMarkChecked
              color={colorMark}
              width={checkboxMarkSize}
              height={checkboxMarkSize}
            />
          ) : null}
        </LeftBox>
        <RightBox>
          <StyledBody disabled={isDisabled}>
            {label}
            {required ? '*' : null}
          </StyledBody>
          {description ? (
            <StyledBodyAccentXs disabled={isDisabled}>{description}</StyledBodyAccentXs>
          ) : null}
        </RightBox>
        {asset ? (
          <BottomBox>
            <CheckboxAsset {...asset} disable={isDisabled} />
          </BottomBox>
        ) : null}
      </ContentContainer>
      {collapsed ? <CollapsedContainer>{collapsed}</CollapsedContainer> : null}
    </CheckboxContainer>
  )
}

type ContainerProps = {
  state: CheckboxState[]
  variant: CheckboxVariant
  collapsed?: React.ReactNode
  display?: CheckboxDisplay
  isHover?: boolean
  isFocus?: boolean
}

const CheckboxContainer = styled(TouchableOpacity)<ContainerProps>(({
  theme,
  state,
  variant,
  display,
  isFocus,
  isHover,
  collapsed,
}) => {
  const { borderColor, backgroundColor } = getCheckboxColors({
    state,
    variant,
    collapsed: !!collapsed,
    theme,
    componentType: 'container',
  })
  const isDetailed = variant === 'detailed'
  const isFilled = display === 'fill'
  const isDisabled = state.includes('disabled')

  return {
    cursor: isDisabled ? 'default' : 'pointer',
    width: isFilled ? '100%' : 'fit-content',
    ...(isDetailed && {
      backgroundColor,
      border: 1,
      borderColor,
      borderRadius: getSpacing(2),
      padding: getSpacing(4),
    }),
    ...customFocusOutline({ isFocus }),
    ...(isDisabled ? {} : getHoverStyle(theme.designSystem.color.text.default, isHover)),
  }
})

const ContentContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  columnGap: getSpacing(4),
})

type LeftBoxProps = {
  variant: CheckboxVariant
  state: CheckboxState[]
}

const LeftBox = styled.View<LeftBoxProps>(({ theme, variant, state }) => {
  const { borderColor, backgroundColor } = getCheckboxColors({
    state,
    variant,
    collapsed: false,
    theme,
    componentType: 'mark',
  })

  return {
    width: theme.checkbox.size,
    height: theme.checkbox.size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.checkbox,
    border: theme.checkbox.border.size,
    borderColor,
    backgroundColor,
  }
})

const StyledBody = styled(Typo.Body)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)<{ disabled?: boolean }>(
  ({ disabled, theme }) => ({
    color: disabled
      ? theme.designSystem.color.text.disabled
      : theme.designSystem.color.text.default,
  })
)

const RightBox = styled.View({
  flex: 1,
})

const BottomBox = styled.View({
  justifyContent: 'center',
})

const CollapsedContainer = styled.View({
  marginTop: getSpacing(4),
})
