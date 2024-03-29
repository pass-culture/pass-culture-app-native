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
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface RadioButtonProps {
  label: string
  description?: string
  complement?: string
  onSelect: (value: string) => void
  isSelected: boolean
  icon?: FunctionComponent<AccessibleIcon>
  accessibilityLabel?: string
  marginVertical?: number
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
      marginVertical={props.marginVertical ?? 0}
      {...props}>
      <LabelContainer ref={containerRef}>
        {!!StyledIcon && (
          <React.Fragment>
            <IconWrapper>
              <StyledIcon />
            </IconWrapper>
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        )}
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

const StyledTouchableOpacity = styled(TouchableOpacity)<{ marginVertical: number }>(
  ({ theme, marginVertical }) => ({
    minHeight: theme.icons.sizes.small,
    marginVertical: marginVertical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
  })
)

const Label = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
  flexGrow: 1,
  flexShrink: 1,
}))

const ComplementLabel = styled(Typo.Caption)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.greyDark,
  marginLeft: getSpacing(2),
  flexShrink: 0,
}))

const IconContainer = styled.View(({ theme }) => ({
  flexShrink: 1,
  flexBasis: 0,
  flexGrow: theme.isMobileViewport ? 0.1 : undefined,
  justifyContent: 'center',
  alignItems: 'flex-end',
  width: theme.icons.sizes.smaller,
  height: theme.icons.sizes.smaller,
  marginLeft: theme.isDesktopViewport ? getSpacing(2) : undefined,
}))

const ValidateIconPrimary = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const ValidateOffIcon = styled(ValidateOff).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))``

const LabelWrapper = styled.View({
  flex: 1,
})

const IconWrapper = styled.View({
  flexShrink: 0,
})

const ContainerWithComplement = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
})
