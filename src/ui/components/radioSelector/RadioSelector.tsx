import React, { useRef } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction.web'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { RadioButtonSelected } from 'ui/svg/RadioButtonSelected'
import { getSpacing, Typo } from 'ui/theme'

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
  onPress: (label: string, type: RadioSelectorType) => void
  description?: string
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
    onPress(label, RadioSelectorType.ACTIVE)
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
        {!!description && <Typo.CaptionNeutralInfo>{description}</Typo.CaptionNeutralInfo>}
      </TextContainer>
      <IconPriceContainer>
        {!!price && <PriceText type={type}>{price}€</PriceText>}
        {type === RadioSelectorType.ACTIVE ? (
          <RadioButtonSelectedPrimary />
        ) : (
          <ValidateOffIcon type={type} />
        )}
      </IconPriceContainer>
    </RadioSelectorContainer>
  )
}

const RadioSelectorContainer = styled(TouchableOpacity)<{ type: RadioSelectorType }>(
  ({ theme, type = RadioSelectorType.DEFAULT }) => {
    let borderWidth = 1
    let backgroundColor

    if (type === RadioSelectorType.ACTIVE) {
      borderWidth = 2
    } else if (type === RadioSelectorType.DISABLED) {
      borderWidth = 0
      backgroundColor = theme.colors.greyLight
    }

    return {
      flexDirection: 'row',
      borderColor: theme.colors.greyDark,
      borderRadius: theme.borderRadius.radius,
      borderWidth,
      padding: getSpacing(4),
      backgroundColor,
    }
  }
)

const TextContainer = styled.View(() => ({
  flex: 1,
}))

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
