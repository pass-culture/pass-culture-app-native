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

export enum RadioSelecteurType {
  DEFAULT = 'default',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

interface ValidateOffIconProps extends AccessibleIcon {
  type?: RadioSelecteurType
}

interface RadioSelecteurProps {
  label: string
  onPress: (label: string, type: RadioSelecteurType) => void
  description?: string
  price?: string
  type?: RadioSelecteurType
}

export const RadioSelecteur: React.FC<RadioSelecteurProps> = ({
  label,
  onPress,
  description,
  price,
  type = RadioSelecteurType.DEFAULT,
}: RadioSelecteurProps) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const handlePress = () => {
    if (type === RadioSelecteurType.DISABLED) {
      return
    }
    onPress(label, RadioSelecteurType.ACTIVE)
  }

  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? handlePress : undefined)
  return (
    <RadioSelecteurContainer
      type={type}
      {...accessibleRadioProps({
        label,
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
        {type === RadioSelecteurType.ACTIVE ? (
          <RadioButtonSelectedPrimary />
        ) : (
          <ValidateOffIcon type={type} />
        )}
      </IconPriceContainer>
    </RadioSelecteurContainer>
  )
}

const RadioSelecteurContainer = styled(TouchableOpacity)<{ type: RadioSelecteurType }>(
  ({ theme, type = RadioSelecteurType.DEFAULT }) => ({
    flexDirection: 'row',
    borderColor: theme.colors.greyDark,
    borderRadius: theme.borderRadius.radius,
    borderWidth:
      type === RadioSelecteurType.ACTIVE ? 2 : type === RadioSelecteurType.DISABLED ? 0 : 1,
    padding: getSpacing(4),
    backgroundColor: type === RadioSelecteurType.DISABLED ? theme.colors.greyLight : undefined,
  })
)

const TextContainer = styled.View(() => ({
  flex: 1,
}))

const ButtonText = styled(Typo.ButtonText)<{ type: RadioSelecteurType }>(({ theme, type }) => ({
  color: type === RadioSelecteurType.DISABLED ? theme.colors.greyDark : theme.colors.black,
}))

const IconPriceContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: getSpacing(2),
})

const ValidateOffIcon = styled(ValidateOff).attrs(
  ({ theme, type }: { theme: DefaultTheme; type: RadioSelecteurType }) => ({
    color: type === RadioSelecteurType.DISABLED ? theme.colors.greyMedium : theme.colors.black,
  })
)<ValidateOffIconProps>``

const RadioButtonSelectedPrimary = styled(RadioButtonSelected).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const PriceText = styled(Typo.Caption)<{ type: RadioSelecteurType }>(({ theme, type }) => ({
  color: type === RadioSelecteurType.DISABLED ? theme.colors.greyDark : theme.colors.black,
  marginRight: getSpacing(2),
}))
