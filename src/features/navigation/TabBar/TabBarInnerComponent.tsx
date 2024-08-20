import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/menu'
import { TabBarTitle as Title } from 'features/navigation/TabBar/TabBarTitle'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer, getSpacing } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleBicolorIcon>
  tabName: TabRouteName
}

export const TabBarInnerComponent: React.FC<Props> = ({ isSelected, BicolorIcon, tabName }) => {
  const accessibilityLabel = menu[tabName].accessibilityLabel
  return (
    <React.Fragment>
      {isSelected ? (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          testID={accessibilityLabel ? `${accessibilityLabel} sélectionné` : undefined}
        />
      ) : null}
      <Spacer.Flex />
      <StyledIcon as={BicolorIcon} selected={isSelected} />
      <Title selected={isSelected} displayName={menu[tabName].displayName} />
      <Spacer.Flex />
      {isSelected ? <BicolorSelectorPlaceholder /> : null}
    </React.Fragment>
  )
}

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.tabBar.iconSize,
  thin: !selected,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })
