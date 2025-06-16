import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { useTabArrowNavigation } from 'features/venue/components/TabLayout/useTabArrowNavigation'
import { TabType } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

import { InfoTab } from './InfoTab'

type TabLayoutProps<TabKeyType extends string> = {
  tabPanels: Record<TabKeyType, React.JSX.Element | null>
  onTabChange?: Partial<Record<TabKeyType, () => void>> | ((tab: TabKeyType) => void)
  tabs: TabType<TabKeyType>[]
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

  useEffect(() => {
    setSelectedTab(defaultTab)
  }, [defaultTab])

  const onTabPress = (tab: TabKeyType) => {
    setSelectedTab(tab)
    if (typeof onTabChange === 'object') {
      onTabChange?.[tab]?.()
    } else if (typeof onTabChange === 'function') {
      onTabChange(tab)
    }
  }

  useTabArrowNavigation<TabKeyType>({
    tabListRef,
    selectedTab,
    setSelectedTab: onTabPress,
    tabs: tabs.map((tab) => tab.key),
  })

  return (
    <Container>
      <TabContainer accessibilityRole={AccessibilityRole.TABLIST} ref={tabListRef} gap={6}>
        <GreyBar />
        {tabs.map((tab) => (
          <InfoTab
            key={tab.key}
            tab={tab.key}
            selectedTab={selectedTab}
            onPress={() => onTabPress(tab.key)}
            Icon={tab.Icon}
            pastille={tab.pastille}
          />
        ))}
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

const TabContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const GreyBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const ContentContainer = styled.View({
  flexGrow: 1,
  flexShrink: 1,
})
