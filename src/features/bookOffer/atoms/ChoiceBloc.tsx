import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
            <Validate color={ColorsEnum.WHITE} size={getSpacing(4.5)} />
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

const ChoiceContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
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

const StrikeLine = styled.View<{ parentWidth: number }>((props) => {
  const strikeLineAngle = (Math.atan2(BUTTON_HEIGHT, props.parentWidth + 2) * 180) / Math.PI
  return {
    transform: `rotate(-${strikeLineAngle}deg)`,
    height: `${LINE_THICKNESS}px`,
    width: `${props.parentWidth + getSpacing(6)}px`,
    backgroundColor: ColorsEnum.GREY_MEDIUM,
    borderRadius: `${LINE_THICKNESS / 2}px`,
    position: 'absolute',
  }
})
