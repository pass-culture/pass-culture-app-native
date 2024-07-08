import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

import { useTabArrowNavigation } from 'features/venue/components/TabLayout/useTabArrowNavigation'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing, Spacer } from 'ui/theme'

import { InfoTab } from './InfoTab'

type TabLayoutProps<TabKeyType extends string> = {
  tabPanels: Record<TabKeyType, JSX.Element>
  onTabChange?: Record<TabKeyType, () => void>
  tabs: { key: TabKeyType }[]
  defaultTab: TabKeyType
}

export const TabLayout = <TabKeyType extends string>({
  tabPanels,
  onTabChange,
  tabs,
  defaultTab,
}: TabLayoutProps<TabKeyType>) => {
  const tabListRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState<TabKeyType>(defaultTab)

  const onTabPress = (tab: TabKeyType) => {
    setSelectedTab(tab)
    onTabChange?.[tab]?.()
  }

  useTabArrowNavigation<TabKeyType>({
    tabListRef,
    selectedTab,
    setSelectedTab: onTabPress,
    tabs: tabs.map((tab) => tab.key),
  })

  return (
    <Container>
      <TabContainer accessibilityRole={AccessibilityRole.TABLIST} ref={tabListRef}>
        <GreyBar />
        <Spacer.Row numberOfSpaces={6} />
        {tabs.map((tab) => (
          <InfoTab
            key={tab.key}
            tab={tab.key}
            selectedTab={selectedTab}
            onPress={() => onTabPress(tab.key)}
          />
        ))}
        <Spacer.Row numberOfSpaces={6} />
      </TabContainer>
      <ContentContainer accessibilityRole={AccessibilityRole.TABPANEL}>
        {tabPanels[selectedTab]}
      </ContentContainer>
    </Container>
  )
}

const Container = styled.View({
  flexGrow: 1,
  flexShrink: 1,
  width: '100%',
})

const TabContainer = styled.View({
  flexDirection: 'row',
})

const GreyBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))

const ContentContainer = styled.View({
  flexGrow: 1,
  flexShrink: 1,
})
