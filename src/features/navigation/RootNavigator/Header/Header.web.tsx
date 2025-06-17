import React, { memo } from 'react'
import webStyled from 'styled-components'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getShadow, getSpacing } from 'ui/theme'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { Nav } from './Nav'

export const Header = memo(function Header({ mainId }: { mainId: string }) {
  const theme = useTheme()
  const routeBadgeMap = useTabBarItemBadges()

  const { user } = useAuthContext()
  const marginHorizontal = user ? theme.contentPage.marginHorizontal * 2 : 0
  const breakpoint = user ? theme.breakpoints.lg : theme.breakpoints.md
  const minWidth = breakpoint + marginHorizontal
  const isDesktopOffset = useMediaQuery({ minWidth })

  return (
    <HeaderContainer>
      <QuickAccess href={`#${mainId}`} title="Aller au contenu principal" />
      {isDesktopOffset ? (
        <LeftContainer>
          <LogoContainer
            navigateTo={{
              screen: homeNavConfig[0],
              params: homeNavConfig[1],
              fromRef: true,
              withPush: true,
            }}>
            <LogoPassCulture />
          </LogoContainer>
        </LeftContainer>
      ) : null}
      <CenterContainer>
        <Nav
          maxWidth={theme.appContentWidth}
          height={theme.navTopHeight}
          routeBadgeMap={routeBadgeMap}
          noShadow
        />
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
    ...getShadow({
      shadowOffset: { width: 0, height: getSpacing(1) },
      shadowRadius: getSpacing(3),
      shadowColor: theme.colors.greyDark,
      shadowOpacity: 0.1,
    }),
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
