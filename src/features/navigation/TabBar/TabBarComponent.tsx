import React from 'react'
import styled from 'styled-components/native'

import { BicolorSelector, computeBicolorSelectorHeight } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Spacer, getSpacing } from 'ui/theme'

export const TAB_BAR_COMP_HEIGHT = getSpacing(16)
const SELECTOR_WIDTH = getSpacing(11)
const SELECTOR_HEIGHT = computeBicolorSelectorHeight(SELECTOR_WIDTH)

interface TabComponentInterface {
  isSelected?: boolean
  bicolorIcon: (props: BicolorIconInterface) => React.ReactNode
  onPress: () => void
  testID: string
}
export const TabBarComponent: React.FC<TabComponentInterface> = ({
  isSelected,
  bicolorIcon,
  onPress,
  testID,
}) => {
  return (
    <TabComponentContainer onPress={onPress} activeOpacity={1} testID={testID}>
      {isSelected && (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          testID={`selector-${testID}`}
        />
      )}
      <Spacer.Flex />
      {bicolorIcon({
        color: isSelected ? undefined : ColorsEnum.GREY_DARK,
        size: getSpacing(11),
      })}
      <Spacer.Flex />
      {isSelected && <BicolorSelectorPlaceholder />}
    </TabComponentContainer>
  )
}
const BicolorSelectorPlaceholder = styled.View({
  height: SELECTOR_HEIGHT,
})
const TabComponentContainer = styled.TouchableOpacity({
  marginTop: -getSpacing(1 / 4),
  height: TAB_BAR_COMP_HEIGHT,
  flex: 1,
  alignItems: 'center',
})
