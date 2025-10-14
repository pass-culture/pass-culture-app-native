import React, { Fragment, FunctionComponent, useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { Spinner } from 'ui/components/Spinner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { getSpacing } from 'ui/theme'
import { Typo } from 'ui/theme/typography'

interface RadioButtonProps {
  label: string
  description?: string
  complement?: string
  onSelect: (value: string) => void
  isSelected: boolean
  icon?: FunctionComponent<AccessibleIcon>
  accessibilityLabel?: string
  isLoading?: boolean
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
      color: theme.designSystem.color.icon.brandPrimary,
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
      {...props}>
      <LabelContainer ref={containerRef}>
        {StyledIcon ? (
          <IconWrapper>
            <StyledIcon />
          </IconWrapper>
        ) : null}
        <LabelWrapper>
          {props.complement ? (
            <ContainerWithComplement>
              <Label isSelected={props.isSelected} numberOfLines={2}>
                {props.label}
              </Label>
              <ComplementLabel isSelected={props.isSelected} numberOfLines={1}>
                {props.complement}
              </ComplementLabel>
            </ContainerWithComplement>
          ) : (
            <Label isSelected={props.isSelected} numberOfLines={2}>
              {props.label}
            </Label>
          )}

          {props.description ? <Description>{props.description}</Description> : null}
        </LabelWrapper>
      </LabelContainer>
      <IconContainer>
        <RadioButtonIcon isSelected={props.isSelected} isLoading={props.isLoading} />
      </IconContainer>
    </StyledTouchableOpacity>
  )
}

const LabelContainerFlex = styled.View.attrs({
  style: { flex: 0.9 },
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

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  minHeight: theme.icons.sizes.small,
  paddingVertical: getSpacing(3),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
}))

const Label = styled(Typo.BodyAccent)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected
    ? theme.designSystem.color.text.brandPrimary
    : theme.designSystem.color.text.default,
  flexGrow: 1,
  flexShrink: 1,
}))

const ComplementLabel = styled(Typo.BodyAccentXs)<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    color: isSelected
      ? theme.designSystem.color.text.brandPrimary
      : theme.designSystem.color.text.default,
    marginLeft: getSpacing(2),
    flexShrink: 0,
  })
)

const Description = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const IconContainer = styled.View(({ theme }) => ({
  flexShrink: 1,
  flexBasis: 0,
  flexGrow: theme.isMobileViewport ? 0.1 : undefined,
  justifyContent: 'center',
  alignItems: 'flex-end',
  width: theme.icons.sizes.smaller,
  height: theme.icons.sizes.smaller,
  marginLeft: theme.isDesktopViewport ? theme.designSystem.size.spacing.s : undefined,
}))

const ValidateIconPrimary = styled(Validate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  color2: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.smaller,
}))``

const ValidateOffIcon = styled(ValidateOff).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
  color2: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.smaller,
}))``

const LabelWrapper = styled.View({
  flex: 1,
})

const IconWrapper = styled.View(({ theme }) => ({
  flexShrink: 0,
  marginRight: theme.designSystem.size.spacing.s,
}))

const ContainerWithComplement = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
})
