import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  hour: string
  price: string
  selected: boolean
  onPress: () => void
  testID: string
}

export const HourChoice: React.FC<Props> = ({ hour, price, selected, onPress, testID }) => {
  const textColor = selected ? ColorsEnum.WHITE : ColorsEnum.BLACK
  return (
    <HourChoiceContainer onPress={onPress} activeOpacity={ACTIVE_OPACITY} testID={testID}>
      <HourChoiceBorder selected={selected}>
        <HourChoiceContent selected={selected}>
          {selected ? (
            <IconContainer>
              <Validate color={ColorsEnum.WHITE} size={getSpacing(6)} />
            </IconContainer>
          ) : (
            <Spacer.Row numberOfSpaces={5} />
          )}
          <Typo.ButtonText testID="hour" color={textColor}>
            {hour}
          </Typo.ButtonText>

          <Typo.Caption testID="price" color={textColor}>
            {price}
          </Typo.Caption>
        </HourChoiceContent>
      </HourChoiceBorder>
    </HourChoiceContainer>
  )
}
const IconContainer = styled.View({
  position: 'absolute',
  top: getSpacing(0.5),
  right: getSpacing(0.5),
})

const HourChoiceContainer = styled.TouchableOpacity({
  width: '33%',
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(2),
})

const HourChoiceBorder = styled.View<{ selected: boolean }>(({ selected }) => ({
  borderRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
  border: `solid 1px`,
  borderColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.GREY_DARK,
  overflow: 'hidden',
}))

const HourChoiceContent = styled.View<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.WHITE,
  paddingHorizontal: getSpacing(3.25),
  paddingVertical: getSpacing(5),
  alignItems: 'center',
  justifyContent: 'center',
}))
