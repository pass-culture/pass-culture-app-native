import React, { Fragment, FunctionComponent, useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { Spinner } from 'ui/components/Spinner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface RadioButtonProps {
  label: string
  description?: string
  onSelect: (value: string) => void
  isSelected: boolean
  icon?: FunctionComponent<IconInterface>
  accessibilityLabel?: string
  marginVertical?: number
  isLoading?: boolean
  isInverted?: boolean
}

type RadioButtonIconProps = {
  isSelected?: boolean
  isLoading?: boolean
}

function RadioButtonIcon({ isSelected, isLoading }: RadioButtonIconProps) {
  const { isMobileViewport, icons } = useTheme()
  const ValidateOff = isMobileViewport ? ValidateOffIcon : Fragment

  if (isSelected) {
    return <ValidateIconPrimary />
  }

  if (isLoading) {
    return <Spinner size={icons.sizes.smaller} />
  }

  return <ValidateOff />
}

export function RadioButton(props: RadioButtonProps) {
  const containerRef = useRef(null)
  const { isMobileViewport } = useTheme()
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const LabelContainer = isMobileViewport ? LabelContainerFlex : LabelContainerWithMarginRight
  const StyledIcon =
    !!props.icon &&
    styled(props.icon).attrs(({ theme }) => ({
      color: theme.colors.primary,
      color2: props.isSelected ? theme.colors.primary : theme.colors.secondary,
      size: theme.icons.sizes.small,
    }))``

  const onPress = () => props.onSelect(props.label)

  const accessibilityLabel = props.description ? `${props.label} ${props.description}` : props.label

  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? onPress : undefined)
  return (
    <StyledTouchableOpacity
      {...accessibleRadioProps({
        checked: props.isSelected,
        label: props.accessibilityLabel || accessibilityLabel,
      })}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      invert={!!props?.isInverted}
      marginVertical={props.marginVertical ?? 0}>
      <LabelContainer ref={containerRef}>
        {!!StyledIcon && (
          <React.Fragment>
            <IconWrapper isInverted={props?.isInverted}>
              <StyledIcon />
            </IconWrapper>
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        )}
        <LabelWrapper>
          <Label isSelected={props.isSelected} numberOfLines={2}>
            {props.label}
          </Label>
          {!!props.description && (
            <Typo.CaptionNeutralInfo>{props.description}</Typo.CaptionNeutralInfo>
          )}
        </LabelWrapper>
      </LabelContainer>
      <IconContainer>
        <RadioButtonIcon isSelected={props.isSelected} isLoading={props.isLoading} />
      </IconContainer>
    </StyledTouchableOpacity>
  )
}

const LabelContainerFlex = styled(Spacer.Flex).attrs({
  flex: 0.9,
})({
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
})

const LabelContainerWithMarginRight = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: theme.isMobileViewport ? 0 : getSpacing(6),
}))

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  marginVertical: number
  invert: boolean
}>(({ theme, marginVertical, invert }) => ({
  minHeight: theme.icons.sizes.small,
  marginVertical: marginVertical,
  flexDirection: invert ? 'row-reverse' : 'row',
  alignItems: 'center',
  justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
}))

const Label = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
})<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const IconContainer = styled.View(({ theme }) => ({
  flex: 0.1,
  justifyContent: 'center',
  alignItems: 'flex-end',
  width: theme.icons.sizes.smaller,
  height: theme.icons.sizes.smaller,
}))

const ValidateIconPrimary = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const ValidateOffIcon = styled(ValidateOff).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))``

const LabelWrapper = styled.View((isInverted) => ({
  flexShrink: 1,
  marginLeft: isInverted ? 15 : 0,
}))

const IconWrapper = styled.View({
  flexShrink: 0,
})
