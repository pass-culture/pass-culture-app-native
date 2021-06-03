import React from 'react'
import styled from 'styled-components/native'

import { testID } from 'tests/utils'
import { BicolorSelector, computeBicolorSelectorHeight } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Spacer, getSpacing, TAB_BAR_COMP_HEIGHT } from 'ui/theme'

const SELECTOR_WIDTH = getSpacing(11)
const SELECTOR_HEIGHT = computeBicolorSelectorHeight(SELECTOR_WIDTH)

interface TabComponentInterface {
  isSelected?: boolean
  bicolorIcon: (props: BicolorIconInterface) => React.ReactNode
  onPress: () => void
  tabName: string
}
export const TabBarComponent: React.FC<TabComponentInterface> = (props) => {
  return (
    <TabComponentContainer
      onPress={props.onPress}
      activeOpacity={1}
      {...testID(`${props.tabName} tab`)}>
      {!!props.isSelected && (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          {...testID(`${props.tabName} tab selected`)}
        />
      )}
      <Spacer.Flex />
      {props.bicolorIcon({
        color: props.isSelected ? undefined : ColorsEnum.GREY_DARK,
        size: getSpacing(11),
        thin: !props.isSelected,
      })}
      <Spacer.Flex />
      {!!props.isSelected && <BicolorSelectorPlaceholder />}
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
