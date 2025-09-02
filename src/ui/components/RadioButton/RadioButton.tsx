import React, { FunctionComponent, useCallback } from 'react'
import { Platform } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { SelectableAsset } from 'ui/components/inputs/SelectableAsset'
import {
  SelectableAssetProps,
  SelectableDisplay,
  SelectableVariant,
} from 'ui/components/inputs/types'
import { getRadioButtonColors } from 'ui/components/RadioButton/getRadioButtonColors'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

const isWeb = Platform.OS === 'web'

export type RadioButtonState = {
  selected: boolean
  error?: boolean
  disabled?: boolean
  default: boolean
}

type RadioButtonBase = {
  label: string
  onSelect: (isSelected: boolean) => void
  hasError?: boolean
  disabled?: boolean
  isSelected: boolean
}

type Props = RadioButtonBase &
  (
    | {
        asset?: never
        collapsed?: never
        description?: never
        display?: SelectableDisplay
        variant?: 'default'
      }
    | {
        asset?: SelectableAssetProps
        collapsed?: never
        description?: string
        display?: SelectableDisplay
        variant?: 'detailed'
      }
    | {
        asset?: SelectableAssetProps
        collapsed: React.ReactNode
        description?: string
        display?: Extract<SelectableDisplay, 'fill'>
        variant?: 'detailed'
      }
  )

export const RadioButton: FunctionComponent<Props> = ({
  asset,
  collapsed,
  description,
  disabled,
  display,
  hasError,
  isSelected,
  label,
  onSelect,
  variant = 'default',
}) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()
  const onToggle = useCallback(() => {
    onSelect(!isSelected)
  }, [isSelected, onSelect])

  useSpaceBarAction(focusProps.isFocus ? onToggle : undefined)

  const effectiveDisplay: SelectableDisplay = display ?? (variant === 'detailed' ? 'fill' : 'hug')

  const state = {
    selected: isSelected,
    error: hasError,
    disabled,
    default: !!isSelected && !!hasError && !!disabled,
  }

  const Label = state.selected ? StyledBodyAccent : StyledBody

  return (
    <RadioButtonContainer
      {...accessibleRadioProps({ checked: state.selected, label })}
      state={state}
      variant={variant}
      display={effectiveDisplay}
      collapsed={collapsed}
      onPress={onToggle}
      {...focusProps}
      {...hoverProps}>
      <ContentContainer>
        <LeftBox state={state} variant={variant} {...hoverProps}>
          {state.selected ? <Round state={state} variant={variant} {...hoverProps} /> : null}
        </LeftBox>
        <RightBox>
          <Label state={state} {...hoverProps}>
            {label}
          </Label>
          {description ? (
            <StyledBodyAccentXs state={state} {...hoverProps}>
              {description}
            </StyledBodyAccentXs>
          ) : null}
        </RightBox>
        {asset ? (
          <BottomBox>
            <SelectableAsset {...asset} disable={state.disabled} />
          </BottomBox>
        ) : null}
      </ContentContainer>
      {collapsed ? <CollapsedContainer>{collapsed}</CollapsedContainer> : null}
    </RadioButtonContainer>
  )
}

type ContainerProps = {
  state: RadioButtonState
  variant: SelectableVariant
  collapsed?: React.ReactNode
  display?: SelectableDisplay
  isHover?: boolean
  isFocus?: boolean
}

const getBorderHoverStyle = ({ theme, state, isHover }: LabelHoverStyleParams) => {
  if (state.disabled || state.error) return {}
  return getHoverStyle({ borderColor: theme.designSystem.color.border.brandPrimary, isHover })
}

const RadioButtonContainer = styled(TouchableOpacity)<ContainerProps>(({
  theme,
  state,
  variant,
  display,
  isFocus,
  isHover,
  collapsed,
}) => {
  const { borderColor, backgroundColor } = getRadioButtonColors({
    state,
    variant,
    collapsed: !!collapsed,
    theme,
    componentType: 'container',
  })

  return {
    cursor: state.disabled ? 'default' : 'pointer',
    width: display === 'fill' ? '100%' : undefined,
    alignSelf: display === 'hug' && isWeb ? 'flex-start' : undefined,
    ...(variant === 'detailed' && {
      backgroundColor,
      border: 1,
      borderColor,
      borderRadius: getSpacing(2),
      padding: getSpacing(4),
    }),
    ...customFocusOutline({ isFocus }),
    ...getBorderHoverStyle({ state, theme, isHover }),
  }
})

const ContentContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  columnGap: getSpacing(3),
})

type NewProps = {
  variant: SelectableVariant
  state: RadioButtonState
  isHover?: boolean
}

const LeftBox = styled.View<NewProps>(({ theme, variant, isHover, state }) => {
  const { borderColor, backgroundColor } = getRadioButtonColors({
    state,
    variant,
    collapsed: false,
    theme,
    componentType: 'circle',
  })
  return {
    width: theme.radioButton.size,
    height: theme.radioButton.size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.radioButton,
    border: theme.radioButton.border.size,
    borderColor,
    backgroundColor,
    ...getBorderHoverStyle({ state, theme, isHover }),
  }
})

const Round = styled.View<NewProps>(({ theme, variant, isHover, state }) => {
  const { backgroundColor } = getRadioButtonColors({
    state,
    variant,
    collapsed: false,
    theme,
    componentType: 'round',
  })
  return {
    width: getSpacing(2.5),
    height: getSpacing(2.5),
    borderRadius: getSpacing(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor,
    ...getBorderHoverStyle({ state, theme, isHover }),
  }
})

type LabelColorParams = {
  theme: DefaultTheme
  state: RadioButtonState
}

const getLabelColor = ({ state, theme }: LabelColorParams) => {
  return state.disabled
    ? theme.designSystem.color.text.disabled
    : theme.designSystem.color.text.default
}

type LabelHoverStyleParams = LabelColorParams & {
  isHover?: boolean
}

const getTextHoverStyle = ({ theme, state, isHover }: LabelHoverStyleParams) => {
  if (state.disabled || state.error) return {}
  return getHoverStyle({ textColor: theme.designSystem.color.text.brandPrimary, isHover })
}

const StyledBody = styled(Typo.Body)<{ state: RadioButtonState; isHover?: boolean }>(
  ({ state, theme, isHover }) => ({
    color: getLabelColor({ state, theme }),
    ...getTextHoverStyle({ state, theme, isHover }),
  })
)

const StyledBodyAccent = styled(Typo.BodyAccent)<{ state: RadioButtonState; isHover?: boolean }>(
  ({ state, theme, isHover }) => ({
    color: getLabelColor({ state, theme }),
    ...getTextHoverStyle({ state, theme, isHover }),
  })
)

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)<{
  state: RadioButtonState
  isHover?: boolean
}>(({ state, isHover, theme }) => {
  return {
    color: state.disabled
      ? theme.designSystem.color.text.disabled
      : theme.designSystem.color.text.default,
    ...getTextHoverStyle({ state, theme, isHover }),
  }
})

const RightBox = styled.View({
  flex: 1,
})

const BottomBox = styled.View({
  justifyContent: 'center',
})

const CollapsedContainer = styled.View({
  marginTop: getSpacing(4),
})
