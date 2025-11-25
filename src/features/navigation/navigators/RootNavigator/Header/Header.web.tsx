import React, { memo } from 'react'
import webStyled from 'styled-components'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing } from 'ui/theme'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { Nav } from './Nav'

export const Header = memo(function Header({ mainId }: { mainId: string }) {
  const { contentPage, breakpoints, appContentWidth, navTopHeight } = useTheme()
  const routeBadgeMap = useTabBarItemBadges()

  const { user } = useAuthContext()
  const marginHorizontal = user ? contentPage.marginHorizontal * 2 : 0
  const breakpoint = user ? breakpoints.lg : breakpoints.md
  const minWidth = breakpoint + marginHorizontal
  const isDesktopOffset = useMediaQuery({ minWidth })

  return (
    <HeaderContainer>
      <QuickAccess href={`#${mainId}`} title="Aller au contenu principal" />
      {isDesktopOffset ? (
        <LeftContainer>
          <LogoContainer
            navigateTo={{
              screen: homeNavigationConfig[0],
              params: homeNavigationConfig[1],
              fromRef: true,
              withPush: true,
            }}>
            <LogoPassCulture />
          </LogoContainer>
        </LeftContainer>
      ) : null}
      <CenterContainer>
        <Nav maxWidth={appContentWidth} height={navTopHeight} routeBadgeMap={routeBadgeMap} />
      </CenterContainer>
      {isDesktopOffset ? (
        <RightContainer>
          <LogoFrenchRepublic />
        </RightContainer>
      ) : null}
    </HeaderContainer>
  )
})

const HeaderContainer = webStyled.header.attrs({ role: 'banner' })(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.designSystem.color.background.default,
    height: theme.navTopHeight,
    justifyContent: 'space-between',
    zIndex: theme.zIndex.header,
  }
})

const CenterContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})

const SideContainer = styled.View({
  width: getSpacing(30),
  flexDirection: 'row',
  alignItems: 'center',
})

const LogoContainer = styled(InternalTouchableLink)({
  justifyContent: 'center',
  height: '100%',
  width: '100%',
})

const LeftContainer = styled(SideContainer)(({ theme }) => ({
  marginLeft: theme.contentPage.marginHorizontal,
  justifyContent: 'flex-start',
}))

const RightContainer = styled(SideContainer)(({ theme }) => ({
  marginRight: theme.contentPage.marginHorizontal,
  justifyContent: 'flex-end',
}))
