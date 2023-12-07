import React, { FunctionComponent, useRef, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableTab } from 'features/venue/components/TabLayout/TouchableTab'
import { useTabArrowNavigation } from 'features/venue/components/TabLayout/useTabArrowNavigation'
import { Tab } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const tabs = Object.values(Tab)

type Props = {
  tabPanels: Record<Tab, JSX.Element>
  onTabChange?: Record<Tab, () => void>
}

export const TabLayout: FunctionComponent<Props> = ({ tabPanels, onTabChange }) => {
  const tabListRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.OFFERS)

  const onTabPress = (tab: Tab) => {
    setSelectedTab(tab)
    onTabChange?.[tab]?.()
  }

  useTabArrowNavigation({ tabListRef, selectedTab, setSelectedTab: onTabPress, tabs })

  return (
    <Container>
      <TabContainer accessibilityRole={AccessibilityRole.TABLIST} ref={tabListRef}>
        <GreyBar />
        <Spacer.Row numberOfSpaces={6} />
        {tabs.map((tab) => {
          const isSelected = selectedTab === tab

          return (
            <StyledTouchableTab
              id={tab}
              key={tab}
              onPress={() => onTabPress(tab)}
              selected={isSelected}>
              <Spacer.Column numberOfSpaces={6} />
              <TabTitleContainer>
                <TabTitle isSelected={isSelected}>{tab}</TabTitle>
              </TabTitleContainer>
              <Spacer.Column numberOfSpaces={2} />
              <BarOfSelectedTab isSelected={isSelected} />
            </StyledTouchableTab>
          )
        })}
        <Spacer.Row numberOfSpaces={6} />
      </TabContainer>
      <View accessibilityRole={AccessibilityRole.TABPANEL}>{tabPanels[selectedTab]}</View>
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
})

const TabContainer = styled.View({
  flexDirection: 'row',
})

const StyledTouchableTab = styled(TouchableTab)({
  flex: 1,
  maxWidth: getSpacing(45),
})

const GreyBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))

const TabTitleContainer = styled.View({ flexGrow: 1, justifyContent: 'center' })

const TabTitle = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  textAlign: 'center',
  color: isSelected ? theme.colors.primary : theme.colors.greyDark,
}))

const BarOfSelectedTab = styled.View<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
  borderRadius: getSpacing(1),
}))
