import React, { FunctionComponent, useRef, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useTabArrowNavigation } from 'features/venue/components/TabLayout/useTabArrowNavigation'
import { Tab } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing, Spacer } from 'ui/theme'

import { InfoTab } from './InfoTab'

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
        {tabs.map((tab) => (
          <InfoTab key={tab} tab={tab} selectedTab={selectedTab} onPress={() => onTabPress(tab)} />
        ))}
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

const GreyBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))
