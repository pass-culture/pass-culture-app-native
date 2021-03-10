import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  selected: boolean
  onPress: () => void
  testID: string
  children: Element
}

export const ChoiceBloc: React.FC<Props> = ({ selected, onPress, testID, children }) => {
  return (
    <ChoiceContainer onPress={onPress} activeOpacity={ACTIVE_OPACITY} testID={testID}>
      <ChoiceBorder selected={selected}>
        <ChoiceContent selected={selected}>
          {selected ? (
            <IconContainer>
              <Validate color={ColorsEnum.WHITE} size={getSpacing(6)} />
            </IconContainer>
          ) : (
            <Spacer.Row numberOfSpaces={5} />
          )}
          {children}
        </ChoiceContent>
      </ChoiceBorder>
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

const ChoiceBorder = styled.View<{ selected: boolean }>(({ selected }) => ({
  borderRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
  border: `solid 1px`,
  borderColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.GREY_DARK,
  overflow: 'hidden',
}))

const ChoiceContent = styled.View<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.WHITE,
  paddingHorizontal: getSpacing(3.25),
  paddingVertical: getSpacing(5),
  alignItems: 'center',
  justifyContent: 'center',
}))
