import colorAlpha from 'color-alpha'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/menu'
import { TabBarTitle } from 'features/navigation/TabBar/TabBarTitle'
import { TabInnerComponentProps } from 'features/navigation/TabBar/types'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { getSpacing, Spacer } from 'ui/theme'

export const TabBarInnerComponentV2: React.FC<TabInnerComponentProps> = ({
  tabName,
  isSelected,
  BicolorIcon,
  badgeValue,
}) => {
  const accessibilityLabel = menu[tabName].accessibilityLabel
  return (
    <React.Fragment>
      {isSelected ? (
        <Gradient testID={accessibilityLabel ? `${accessibilityLabel} sélectionné` : undefined} />
      ) : null}
      <Spacer.Flex />
      <StyledIcon as={BicolorIcon} selected={isSelected} badgeValue={badgeValue} />
      <Spacer.Column numberOfSpaces={2.5} />
      <TabBarTitle selected={isSelected} displayName={menu[tabName].displayName} />
      <Spacer.Flex />
      {isSelected ? <BicolorSelectorPlaceholder /> : null}
    </React.Fragment>
  )
}

const GRADIENT_HEIGHT = getSpacing(0.5)

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.primary, 0),
    theme.colors.primary,
    theme.colors.secondary,
    colorAlpha(theme.colors.secondary, 0),
  ],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))({ height: GRADIENT_HEIGHT, width: '100%' })

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.icons.sizes.small,
  thin: true,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: GRADIENT_HEIGHT })
