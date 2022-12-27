import React from 'react'
import styled, { useTheme, DefaultTheme } from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer } from 'ui/theme'

const getBorderColor = (theme: DefaultTheme, selected: boolean, disabled?: boolean) => {
  if (selected) return theme.colors.primary
  if (disabled) return theme.colors.greyMedium
  return theme.colors.greyDark
}

export const getTextColor = (theme: DefaultTheme, selected: boolean, disabled: boolean) => {
  if (selected) return theme.colors.white
  if (disabled) return theme.colors.greyDark
  return theme.colors.black
}

interface Props {
  selected: boolean
  onPress: () => void
  children: JSX.Element
  accessibilityLabel: string
  disabled?: boolean
}

const LINE_THICKNESS = 1
const CHOICE_BLOCS_BY_LINE = 3
const BUTTON_HEIGHT = getSpacing(20)

export const ChoiceBloc: React.FC<Props> = ({
  selected,
  onPress,
  accessibilityLabel,
  children,
  disabled,
}) => {
  const { appContentWidth } = useTheme()
  const buttonWidth =
    (appContentWidth - 2 * getSpacing(4) - CHOICE_BLOCS_BY_LINE * getSpacing(2)) /
    CHOICE_BLOCS_BY_LINE

  const label = selected ? `${accessibilityLabel} sélectionné` : accessibilityLabel
  return (
    <ChoiceContainer onPress={onPress} disabled={disabled} accessibilityLabel={label}>
      <ChoiceContent selected={selected} disabled={disabled}>
        {selected ? (
          <IconContainer>
            <Validate />
          </IconContainer>
        ) : (
          <Spacer.Row numberOfSpaces={5} />
        )}
        {children}
        {!!disabled && <StrikeLine parentWidth={buttonWidth} />}
      </ChoiceContent>
    </ChoiceContainer>
  )
}
const IconContainer = styled.View({
  position: 'absolute',
  top: getSpacing(0.5),
  right: getSpacing(0.5),
})

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.extraSmall,
}))``

const ChoiceContainer = styled(TouchableOpacity)({
  width: '33%',
  padding: getSpacing(2),
})

const ChoiceContent = styled.View<{ selected: boolean; disabled?: boolean }>(
  ({ theme, selected, disabled }) => ({
    borderRadius: theme.borderRadius.checkbox,
    border: `solid 1px`,
    borderColor: getBorderColor(theme, selected, disabled),
    overflow: 'hidden',
    backgroundColor: selected ? theme.colors.primary : theme.colors.white,
    paddingHorizontal: getSpacing(3.25),
    alignItems: 'center',
    justifyContent: 'center',
  })
)

const StrikeLine = styled.View<{ parentWidth: number }>(({ parentWidth, theme }) => {
  const strikeLineAngle = (Math.atan2(BUTTON_HEIGHT, parentWidth + 2) * 180) / Math.PI
  return {
    transform: `rotate(-${strikeLineAngle}deg)`,
    height: `${LINE_THICKNESS}px`,
    width: `${parentWidth + getSpacing(6)}px`,
    backgroundColor: theme.colors.greyMedium,
    borderRadius: `${LINE_THICKNESS / 2}px`,
    position: 'absolute',
  }
})
