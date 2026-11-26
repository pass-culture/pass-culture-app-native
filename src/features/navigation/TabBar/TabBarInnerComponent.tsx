import colorAlpha from 'color-alpha'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { TabInnerComponentProps } from 'features/navigation/navigators/TabNavigator/types'
import { FavoritesChip } from 'features/navigation/TabBar/FavoritesChip'
import { menu } from 'features/navigation/TabBar/menu'
import { TabBarTitle } from 'features/navigation/TabBar/TabBarTitle'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { LogoDetailed } from 'ui/svg/icons/LogoDetailed'

export const TabBarInnerComponent: React.FC<TabInnerComponentProps> = ({
  tabName,
  isSelected,
  BicolorIcon,
  badgeValue,
  showFavoritesChip,
}) => {
  const { icons, designSystem } = useTheme()

  const accessibilityLabel = menu[tabName].accessibilityLabel

  const title = useMobileFontScaleToDisplay({
    default: <TabBarTitle selected={isSelected} displayName={menu[tabName].displayName} />,
    at200PercentZoom: null,
  })

  const iconSize = useMobileFontScaleToDisplay({
    default: icons.sizes.small,
    at200PercentZoom: designSystem.size.icon.l,
  })

  return (
    <React.Fragment>
      {isSelected ? (
        <Gradient testID={accessibilityLabel ? `${accessibilityLabel} sélectionné` : undefined} />
      ) : null}
      <MainContent>
        <IconWrapper>
          <StyledIcon
            as={BicolorIcon}
            selected={isSelected}
            iconSize={iconSize}
            badgeValue={badgeValue}
          />
          {showFavoritesChip ? <FavoritesChip testID={`${tabName}-new-feature-chip`} /> : null}
        </IconWrapper>
        {title}
      </MainContent>
      {isSelected ? <BicolorSelectorPlaceholder /> : null}
    </React.Fragment>
  )
}

const MainContent = styled.View({
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
})

const Gradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.icon.brandPrimary, 0),
    theme.designSystem.color.icon.brandPrimary,
    theme.designSystem.color.icon.brandPrimary,
    colorAlpha(theme.designSystem.color.icon.brandPrimary, 0),
  ],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))(({ theme }) => ({ height: theme.designSystem.size.spacing['2xs'], width: '100%' }))

const StyledIcon = styled(LogoDetailed).attrs<{ selected?: boolean; iconSize: number }>(
  ({ theme, selected, iconSize }) => ({
    color: selected
      ? theme.designSystem.color.icon.brandPrimary
      : theme.designSystem.color.icon.subtle,
    size: iconSize,
    thin: true,
  })
)``

const BicolorSelectorPlaceholder = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing['2xs'],
}))

const IconWrapper = styled.View(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.designSystem.size.spacing.m,
}))
