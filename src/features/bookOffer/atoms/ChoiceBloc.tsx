import React from 'react'
import styled, { useTheme, DefaultTheme } from 'styled-components/native'

import { Validate as ValidateDefault } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer } from 'ui/theme'

const getBorderColor = (selected: boolean, theme: DefaultTheme, disabled?: boolean) => {
  if (selected) return theme.colors.primary
  if (disabled) return theme.colors.greyMedium
  return theme.colors.greyDark
}

export const useTextColor = (selected: boolean, disabled: boolean) => {
  const { colors } = useTheme()
  if (selected) return colors.white
  if (disabled) return colors.greyDark
  return colors.black
}

interface Props {
  selected: boolean
  onPress: () => void
  testID?: string
  children: JSX.Element
  disabled?: boolean
}

const LINE_THICKNESS = 1
const CHOICE_BLOCS_BY_LINE = 3
const BUTTON_HEIGHT = getSpacing(20)

export const ChoiceBloc: React.FC<Props> = ({ selected, onPress, testID, children, disabled }) => {
  const { appContentWidth } = useTheme()
  const buttonWidth =
    (appContentWidth - 2 * getSpacing(4) - CHOICE_BLOCS_BY_LINE * getSpacing(2)) /
    CHOICE_BLOCS_BY_LINE
  return (
    <ChoiceContainer onPress={onPress} testID={testID} disabled={disabled}>
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

const Validate = styled(ValidateDefault).attrs(({ theme }) => ({
  colors: theme.colors.white,
  size: getSpacing(4.5),
}))``

const IconContainer = styled.View({
  position: 'absolute',
  top: getSpacing(0.5),
  right: getSpacing(0.5),
})

const ChoiceContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  width: '33%',
  padding: getSpacing(2),
})

const ChoiceContent = styled.View<{ selected: boolean; disabled?: boolean }>(
  ({ selected, disabled, theme }) => ({
    borderRadius: theme.borderRadius.checkbox,
    border: `solid 1px`,
    borderColor: getBorderColor(selected, theme, disabled),
    overflow: 'hidden',
    backgroundColor: selected ? theme.colors.primary : theme.colors.white,
    paddingHorizontal: getSpacing(3.25),
    alignItems: 'center',
    justifyContent: 'center',
  })
)

const StrikeLine = styled.View<{ parentWidth: number }>((props) => {
  const strikeLineAngle = (Math.atan2(BUTTON_HEIGHT, props.parentWidth + 2) * 180) / Math.PI
  return {
    transform: `rotate(-${strikeLineAngle}deg)`,
    height: `${LINE_THICKNESS}px`,
    width: `${props.parentWidth + getSpacing(6)}px`,
    backgroundColor: props.theme.colors.greyMedium,
    borderRadius: `${LINE_THICKNESS / 2}px`,
    position: 'absolute',
  }
})
