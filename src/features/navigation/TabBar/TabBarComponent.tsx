import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, getSpacing, Typo } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
  tabName: TabRouteName
}

const isWeb = Platform.OS === 'web'

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  BicolorIcon,
  navigateTo,
  onPress,
  tabName,
}) => {
  const commonProps = {
    activeOpacity: 1,
    selected: isSelected,
    accessibilityLabel: menu[tabName].accessibilityLabel,
    testID: menu[tabName].accessibilityLabel || menu[tabName].displayName,
    accessibilityRole: AccessibilityRole.LINK,
  }
  const Content = (
    <React.Fragment>
      {!!isSelected && (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          testID={`${menu[tabName].accessibilityLabel} sélectionné`}
        />
      )}
      <Spacer.Flex />
      <StyledIcon as={BicolorIcon} selected={isSelected} />
      <Title selected={isSelected}>{menu[tabName].displayName}</Title>
      <Spacer.Flex />
      {!!isSelected && <BicolorSelectorPlaceholder />}
    </React.Fragment>
  )
  if (navigateTo) {
    return (
      <TabComponentContainerLink
        navigateTo={navigateTo}
        onBeforeNavigate={onPress}
        {...commonProps}
        aria-current={isSelected ? 'page' : undefined}>
        {Content}
      </TabComponentContainerLink>
    )
  } else
    return (
      <TabComponentContainer
        onPress={onPress}
        {...commonProps}
        aria-current={isSelected ? 'page' : undefined}>
        {Content}
      </TabComponentContainer>
    )
}

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.tabBar.iconSize,
  thin: !selected,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainerLink = styled(InternalTouchableLink).attrs(
  ({ theme, accessibilityLabel, selected }) => ({
    accessibilityLabel: theme.tabBar.showLabels && isWeb ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected ? theme.colors.black : theme.colors.greyDark,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))

const TabComponentContainer = styled(TouchableOpacity).attrs<{ selected: boolean }>(
  ({ theme, accessibilityLabel, selected }) => ({
    accessibilityLabel: theme.tabBar.showLabels && isWeb ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected ? theme.colors.black : theme.colors.greyDark,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))

const Title = styled(Typo.Caption)<{ selected?: boolean }>(({ theme, selected }) => ({
  display: theme.tabBar.showLabels ? undefined : 'none',
  color: selected ? theme.colors.black : theme.colors.greyDark,
  fontSize: theme.tabBar.fontSize,
  textAlign: 'center',
}))
