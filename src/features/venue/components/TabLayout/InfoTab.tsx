import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { Tab } from 'features/venue/types'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { TouchableTab } from './TouchableTab'

type InfoTabProps = {
  tab: Tab
  selectedTab: Tab
  onPress: () => void
}

export const InfoTab = ({ tab, selectedTab, onPress }: InfoTabProps) => {
  const isSelected = selectedTab === tab
  const { isHover, ...webHoverProps } = useHandleHover()
  const hoverProps = Platform.OS === 'web' ? webHoverProps : {}

  return (
    <StyledTouchableTab id={tab} onPress={onPress} selected={isSelected} {...hoverProps}>
      <TabTitleContainer>
        <TabTitle isHover={isHover} isSelected={isSelected}>
          {tab}
        </TabTitle>
      </TabTitleContainer>
      <Spacer.Column numberOfSpaces={2} />
      <BarOfSelectedTab isSelected={isSelected} />
    </StyledTouchableTab>
  )
}

const StyledTouchableTab = styled(TouchableTab)({
  flex: 1,
  maxWidth: getSpacing(45),
})

const TabTitleContainer = styled.View({ flexGrow: 1, justifyContent: 'center' })

const TabTitle = styled(Typo.ButtonText)<{ isSelected: boolean; isHover: boolean }>(
  ({ isSelected, isHover, theme }) => ({
    textAlign: 'center',
    color: isSelected || isHover ? theme.colors.primary : theme.colors.greyDark,
  })
)

const BarOfSelectedTab = styled.View<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
  borderRadius: getSpacing(1),
}))
