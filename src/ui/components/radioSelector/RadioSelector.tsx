import React, { useRef } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { RadioButtonSelected } from 'ui/svg/RadioButtonSelected'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export enum RadioSelectorType {
  DEFAULT = 'default',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

interface ValidateOffIconProps extends AccessibleIcon {
  type?: RadioSelectorType
}

interface RadioSelectorProps {
  label: string
  onPress: () => void
  description?: string | null
  price?: string
  type?: RadioSelectorType
}

export const RadioSelector = ({
  label,
  onPress,
  description,
  price,
  type = RadioSelectorType.DEFAULT,
}: RadioSelectorProps) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const handlePress = () => {
    if (type === RadioSelectorType.DISABLED) {
      return
    }
    onPress()
  }

  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? handlePress : undefined)
  return (
    <RadioSelectorContainer
      type={type}
      {...accessibleRadioProps({
        label,
        checked: type === RadioSelectorType.ACTIVE,
      })}
      onPress={handlePress}
      onFocus={onFocus}
      onBlur={onBlur}>
      <TextContainer>
        <ButtonText type={type}>{label}</ButtonText>
        <Spacer.Column numberOfSpaces={1} />
        {!!description && <Typo.CaptionNeutralInfo>{description}</Typo.CaptionNeutralInfo>}
      </TextContainer>
      <IconPriceContainer>
        {!!price && <PriceText type={type}>{price}</PriceText>}
        {type === RadioSelectorType.ACTIVE ? (
          <RadioButtonSelectedPrimary testID="radio-button-selected-primary" />
        ) : (
          <ValidateOffIcon type={type} testID="validate-off-icon" />
        )}
      </IconPriceContainer>
    </RadioSelectorContainer>
  )
}

const DefaultRadio = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: theme.colors.greyDark,
  borderRadius: theme.borderRadius.radius,
  padding: getSpacing(4),
  backgroundColor: 'transparent',
  minHeight: 80,
  maxHeight: 80,
  alignItems: 'center',
}))

const ActiveRadio = styled(DefaultRadio)({
  borderWidth: 2,
})

const DisabledRadio = styled(DefaultRadio)(({ theme }) => ({
  borderWidth: 0,
  backgroundColor: theme.colors.greyLight,
}))

const RadioSelectorContainer = ({ type = RadioSelectorType.DEFAULT, ...props }) => {
  if (type === RadioSelectorType.DISABLED) return <DisabledRadio {...props} />
  if (type === RadioSelectorType.ACTIVE) return <ActiveRadio {...props} />
  return <DefaultRadio {...props} />
}

const TextContainer = styled.View({
  flex: 1,
})

const ButtonText = styled(Typo.ButtonText)<{ type: RadioSelectorType }>(({ theme, type }) => ({
  color: type === RadioSelectorType.DISABLED ? theme.colors.greyDark : theme.colors.black,
}))

const IconPriceContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: getSpacing(2),
})

const ValidateOffIcon = styled(ValidateOff).attrs(
  ({ theme, type }: { theme: DefaultTheme; type: RadioSelectorType }) => ({
    color: type === RadioSelectorType.DISABLED ? theme.colors.greyMedium : theme.colors.black,
  })
)<ValidateOffIconProps>``

const RadioButtonSelectedPrimary = styled(RadioButtonSelected).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const PriceText = styled(Typo.Caption)<{ type: RadioSelectorType }>(({ theme, type }) => ({
  color: type === RadioSelectorType.DISABLED ? theme.colors.greyDark : theme.colors.black,
  marginRight: getSpacing(2),
}))
