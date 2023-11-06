import React, { useState } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, Typo } from 'ui/theme'

enum Tab {
  OFFERS = 'Offres disponibles',
  INFOS = 'Infos pratiques',
}
const tabs = Object.values(Tab)

export const TabLayout = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.OFFERS)

  return (
    <Container>
      <TabContainer>
        <GreyBar />
        <Spacer.Row numberOfSpaces={6} />
        {tabs.map((tab) => (
          <TouchableTab key={tab} onPress={() => setSelectedTab(tab)}>
            <Spacer.Column numberOfSpaces={6} />
            <TabTitle isSelected={selectedTab === tab}>{tab}</TabTitle>
            <Spacer.Column numberOfSpaces={2} />
            {selectedTab === tab && <BarOfSelectedTab />}
          </TouchableTab>
        ))}
        <Spacer.Row numberOfSpaces={6} />
      </TabContainer>
      <ExampleText>{selectedTab}</ExampleText>
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
})

const TabContainer = styled.View({
  flexDirection: 'row',
})

const TouchableTab = styled(TouchableOpacity)({
  flex: 1,
  maxWidth: getSpacing(45),
  alignItems: 'center',
})

const GreyBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))

const TabTitle = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.greyDark,
}))

const BarOfSelectedTab = styled.View(({ theme }) => ({
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.primary,
  borderRadius: getSpacing(1),
}))

const ExampleText = styled(Typo.Body)({
  margin: getSpacing(6),
})
