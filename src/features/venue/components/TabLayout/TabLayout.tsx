import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableTab } from 'features/venue/components/TabLayout/TouchableTab'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing, Spacer, Typo } from 'ui/theme'

enum Tab {
  OFFERS = 'Offres disponibles',
  INFOS = 'Infos pratiques',
}
const tabs = Object.values(Tab)

type Props = {
  tabPanels: Record<Tab, JSX.Element>
}

export const TabLayout: FunctionComponent<Props> = ({ tabPanels }) => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.OFFERS)
  const tabListRef = useRef(null)

  const eventListener = useCallback(
    // Keyboard navigation with the arrow keys though the tabs
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#keyboard_interaction
    (event: KeyboardEvent) => {
      if (!tabListRef.current) return
      const htmlRef = tabListRef.current as unknown as HTMLDivElement

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const index = tabs.indexOf(selectedTab)
        const nextIndex =
          event.key === 'ArrowRight'
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length // + length, to avoid -1%length -> -1 instead of 1
        setSelectedTab(tabs[nextIndex])

        htmlRef?.querySelector<HTMLDivElement>(`[role="tab"][id="${tabs[nextIndex]}"]`)?.focus()
      }
    },
    [selectedTab]
  )

  useEffect(() => {
    if (Platform.OS !== 'web') return
    if (!tabListRef.current) return
    const htmlRef = tabListRef.current as unknown as HTMLDivElement

    htmlRef.addEventListener('keydown', eventListener)
    return () => htmlRef.removeEventListener('keydown', eventListener)
  })

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
              onPress={() => setSelectedTab(tab)}
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
