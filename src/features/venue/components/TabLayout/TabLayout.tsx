import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

import { useTabArrowNavigation } from 'features/venue/components/TabLayout/useTabArrowNavigation'
import { TabKey } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing, Spacer } from 'ui/theme'

import { InfoTab } from './InfoTab'

type TabLayoutProps<T extends TabKey> = {
  tabPanels: Record<T, JSX.Element>
  onTabChange?: Record<T, () => void>
  tabs: { key: T }[]
  defaultTab: T
}

export const TabLayout = <T extends TabKey>({
  tabPanels,
  onTabChange,
  tabs,
  defaultTab,
}: TabLayoutProps<T>) => {
  const tabListRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState<T>(defaultTab)

  const onTabPress = (tab: T) => {
    setSelectedTab(tab)
    onTabChange?.[tab]?.()
  }

  useTabArrowNavigation<T>({
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
})
