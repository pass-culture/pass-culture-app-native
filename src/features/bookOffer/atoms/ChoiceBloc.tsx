import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

const LINE_THICKNESS = 1
const CHOICE_BLOCS_BY_LINE = 3
const buttonWidth =
  (Dimensions.get('window').width - 2 * getSpacing(4) - CHOICE_BLOCS_BY_LINE * getSpacing(2)) /
  CHOICE_BLOCS_BY_LINE

const buttonHeight = getSpacing(20)

const strikeLineAngle = (Math.atan2(buttonHeight, buttonWidth + 2) * 180) / Math.PI

const getBorderColor = (selected: boolean, disabled?: boolean) => {
  if (selected) return ColorsEnum.PRIMARY
  if (disabled) return ColorsEnum.GREY_MEDIUM
  return ColorsEnum.GREY_DARK
}

export const getTextColor = (selected: boolean, disabled: boolean) => {
  if (selected) return ColorsEnum.WHITE
  if (disabled) return ColorsEnum.GREY_DARK
  return ColorsEnum.BLACK
}
interface Props {
  selected: boolean
  onPress: () => void
  testID?: string
  children: Element
  disabled?: boolean
}

export const ChoiceBloc: React.FC<Props> = ({ selected, onPress, testID, children, disabled }) => {
  return (
    <ChoiceContainer
      onPress={onPress}
      activeOpacity={ACTIVE_OPACITY}
      testID={testID}
      disabled={disabled}>
      <ChoiceContent selected={selected} disabled={disabled}>
        {selected ? (
          <IconContainer>
            <Validate color={ColorsEnum.WHITE} size={getSpacing(6)} />
          </IconContainer>
        ) : (
          <Spacer.Row numberOfSpaces={5} />
        )}
        {children}
        {disabled && <StrikeLine />}
      </ChoiceContent>
    </ChoiceContainer>
  )
}
const IconContainer = styled.View({
  position: 'absolute',
  top: getSpacing(0.5),
  right: getSpacing(0.5),
})

const ChoiceContainer = styled.TouchableOpacity({
  width: '33%',
  padding: getSpacing(2),
})

const ChoiceContent = styled.View<{ selected: boolean; disabled?: boolean }>(
  ({ selected, disabled }) => ({
    borderRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
    border: `solid 1px`,
    borderColor: getBorderColor(selected, disabled),
    overflow: 'hidden',
    backgroundColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.WHITE,
    paddingHorizontal: getSpacing(3.25),
    alignItems: 'center',
    justifyContent: 'center',
  })
)

const StrikeLine = styled.View`
  transform: rotate(-${strikeLineAngle}deg);
  height: ${LINE_THICKNESS}px;
  width: ${buttonWidth + getSpacing(6)}px;
  background-color: ${ColorsEnum.GREY_MEDIUM};
  border-radius: ${LINE_THICKNESS / 2}px;
  position: absolute;
`
