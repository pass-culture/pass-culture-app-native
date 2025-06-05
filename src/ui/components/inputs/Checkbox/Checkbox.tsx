import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { CheckboxAsset, CheckboxAssetProps } from 'ui/components/inputs/Checkbox/CheckboxAsset'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { CheckboxMarkIndeterminate } from 'ui/svg/icons/CheckboxMarkIndeterminate'
import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { Typo, getSpacing } from 'ui/theme'

type CheckboxBase = {
  label: string
  onPress: (isChecked: boolean) => void
  isChecked: boolean
  indeterminate?: boolean
  required?: boolean
  hasError?: boolean
  disabled?: boolean
}

type Props = CheckboxBase &
  (
    | {
        variant?: 'default'
        description?: never
        asset?: never
        collapsed?: never
        display?: 'hug' | 'fill'
      }
    | {
        variant?: 'detailed'
        description?: string
        asset?: CheckboxAssetProps
        collapsed?: never
        display?: 'hug' | 'fill'
      }
    | {
        variant?: 'detailed'
        collapsed: React.ReactNode
        description?: string
        asset?: CheckboxAssetProps
        display?: 'fill'
      }
  )

export const Checkbox: FunctionComponent<Props> = ({
  label,
  required,
  onPress,
  variant,
  description,
  asset,
  display,
  isChecked,
  indeterminate,
  collapsed,
  hasError,
  disabled,
}) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const onToggle = useCallback(() => {
    onPress(!isChecked)
  }, [isChecked, onPress])

  useSpaceBarAction(isFocus ? onToggle : undefined)

  const effectiveDisplay: 'fill' | 'hug' = display ?? (variant === 'detailed' ? 'fill' : 'hug')

  return (
    <Container
      {...accessibleCheckboxProps({ checked: isChecked, label, required })}
      isChecked={isChecked}
      indeterminate={indeterminate}
      variant={variant}
      display={effectiveDisplay}
      hasError={hasError}
      disabled={disabled}
      collapsed={collapsed}
      onPress={onToggle}
      onFocus={onFocus}
      onBlur={onBlur}>
      <ContentContainer>
        <Box
          isChecked={isChecked}
          indeterminate={indeterminate}
          hasError={hasError}
          variant={variant}
          disabled={disabled}>
          {isChecked ? <CheckboxMark /> : null}
          {indeterminate ? <CheckboxMarkIndeterminate /> : null}
        </Box>
        <LabelContainer>
          <StyledBody disabled={disabled}>
            {label}
            {required ? '*' : null}
          </StyledBody>
          {description ? (
            <StyledBodyAccentXs disabled={disabled}>{description}</StyledBodyAccentXs>
          ) : null}
        </LabelContainer>
        {asset ? (
          <AssetContainer>
            <CheckboxAsset {...asset} />
          </AssetContainer>
        ) : null}
      </ContentContainer>
      {collapsed ? <CollapsetContainer>{collapsed}</CollapsetContainer> : null}
    </Container>
  )
}

type ContainerProps = {
  isChecked?: boolean
  indeterminate?: boolean
  variant?: 'default' | 'detailed'
  display?: 'hug' | 'fill'
  hasError?: boolean
  disabled?: boolean
  collapsed?: React.ReactNode
}

const Container = styled(TouchableOpacity)<ContainerProps>(
  ({ theme, variant, display, hasError, disabled, isChecked, indeterminate, collapsed }) => ({
    cursor: 'pointer',
    width: display === 'fill' ? '100%' : 'fit-content',
    ...(variant === 'detailed' && {
      border: 1,
      borderColor: hasError
        ? theme.designSystem.color.border.error
        : isChecked || indeterminate
          ? theme.designSystem.color.border.brandPrimary
          : disabled
            ? theme.designSystem.color.border.disabled
            : theme.designSystem.color.border.default,
      backgroundColor: disabled
        ? theme.designSystem.color.background.disabled
        : (isChecked && !collapsed) || (indeterminate && !collapsed)
          ? theme.designSystem.color.background.brandPrimarySelected
          : theme.designSystem.color.background.default,
      borderRadius: getSpacing(2),
      padding: getSpacing(4),
    }),
  })
)

const ContentContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  columnGap: getSpacing(4),
})

type BoxProps = {
  isChecked: boolean
  indeterminate?: boolean
  hasError?: boolean
  disabled?: boolean
  variant?: 'default' | 'detailed'
}

const Box = styled.View<BoxProps>(
  ({ isChecked, indeterminate, hasError, disabled, variant, theme }) => ({
    width: theme.checkbox.size,
    height: theme.checkbox.size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.checkbox,
    border: theme.checkbox.border.size,
    borderColor:
      isChecked || indeterminate
        ? theme.designSystem.color.border.brandPrimary
        : hasError
          ? theme.designSystem.color.border.error
          : disabled
            ? theme.designSystem.color.border.disabled
            : theme.designSystem.color.border.default,
    backgroundColor:
      isChecked || indeterminate
        ? theme.designSystem.color.background.brandPrimary
        : disabled && variant === 'detailed'
          ? theme.designSystem.color.background.disabled
          : theme.designSystem.color.background.default,
  })
)

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

const LabelContainer = styled.View({
  flex: 1,
})

const AssetContainer = styled.View({
  justifyContent: 'center',
})

const CollapsetContainer = styled.View({
  marginTop: getSpacing(4),
})
