import React, { useRef, useEffect, memo } from 'react'
import { Animated } from 'react-native'
import webStyled from 'styled-components'
import styled, { useTheme } from 'styled-components/native'

import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getShadow, getSpacing } from 'ui/theme'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { Nav } from './Nav'

const MINIMUM_BRAND_SIZE = 140

export const Header = memo(function Header({ mainId }: { mainId: string }) {
  const theme = useTheme()
  const routeBadgeMap = useTabBarItemBadges()

  const fadeAnim = useRef({
    opacity: new Animated.Value(0),
  }).current
  const fadeAnimSmall = useRef({
    opacity: new Animated.Value(0),
  }).current
  const margin = getSpacing(6)

  // we add the left and right margin to trigger the media query early than the display none and get the smooth effect
  const isDesktopOffset = useMediaQuery({ minWidth: theme.breakpoints.lg + margin * 2 })

  // we hide brand when we can't display them at minimum brand size
  const isBrandVisible = useMediaQuery({
    minWidth: theme.breakpoints.lg + margin * 2 + MINIMUM_BRAND_SIZE * 2,
  })

  function fadeInDesktop() {
    Animated.timing(fadeAnim.opacity, {
      toValue: 1,
      useNativeDriver: false,
      duration: 700,
    }).start()
  }

  function fadeOutDesktop() {
    Animated.timing(fadeAnim.opacity, {
      toValue: 0,
      useNativeDriver: false,
      duration: 700,
    }).start()
  }

  function fadeInTablette() {
    Animated.timing(fadeAnimSmall.opacity, {
      toValue: 1,
      useNativeDriver: false,
      duration: 700,
    }).start()
  }

  function fadeOutTablette() {
    Animated.timing(fadeAnimSmall.opacity, {
      toValue: 0,
      useNativeDriver: false,
      duration: 700,
    }).start()
  }

  useEffect(() => {
    if (isBrandVisible) {
      fadeInDesktop()
      fadeOutTablette()
      return
    }
    fadeOutDesktop()
    fadeInTablette()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrandVisible])

  return (
    <HeaderContainer>
      <QuickAccess href={`#${mainId}`} title="Aller au contenu principal" />
      <LeftContainer margin={margin} isVisible={!!isDesktopOffset} style={fadeAnim}>
        {isBrandVisible ? (
          <LogoContainer
            navigateTo={{
              screen: homeNavConfig[0],
              params: homeNavConfig[1],
              fromRef: true,
              withPush: true,
            }}>
            <LogoPassCulture
              color={theme.uniqueColors.brand}
              height={getSpacing(10)}
              width="100%"
            />
          </LogoContainer>
        ) : null}
        <FlexContainer />
      </LeftContainer>
      <CenterContainer isDesktop={theme.isDesktopViewport}>
        <LeftContainer
          margin={margin}
          isVisible
          style={fadeAnimSmall}
          accessibilityHidden={!!isBrandVisible}>
          <LogoPassCulture color={theme.uniqueColors.brand} height={getSpacing(6.5)} width={80} />
        </LeftContainer>
        <Nav
          maxWidth={theme.appContentWidth}
          height={theme.navTopHeight}
          noShadow={theme.isDesktopViewport}
          routeBadgeMap={routeBadgeMap}
        />
        <RightContainer
          margin={margin}
          isVisible
          style={fadeAnimSmall}
          accessibilityHidden={!!isBrandVisible}>
          <FlexContainer alignItems="flex-end">
            <LogoFrenchRepublicContainer height={getSpacing(11)} width={getSpacing(15.5)}>
              <LogoFrenchRepublic />
            </LogoFrenchRepublicContainer>
          </FlexContainer>
        </RightContainer>
      </CenterContainer>
      <RightContainer
        margin={margin}
        isVisible={!!isDesktopOffset}
        style={fadeAnim}
        accessibilityHidden={!isBrandVisible}>
        <FlexContainer />
        <FlexContainer>
          <LogoFrenchRepublicContainer>
            <LogoFrenchRepublic />
          </LogoFrenchRepublicContainer>
        </FlexContainer>
      </RightContainer>
    </HeaderContainer>
  )
})

const HeaderContainer = webStyled.header.attrs({ role: 'banner' })(({ theme }) => {
  return {
    display: 'flex',
    flexGrow: 1,
    maxHeight: theme.navTopHeight,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    zIndex: theme.zIndex.header,
    ...getShadow({
      shadowOffset: {
        width: 0,
        height: getSpacing(1),
      },
      shadowRadius: getSpacing(3),
      shadowColor: theme.colors.greyDark,
      shadowOpacity: 0.1,
    }),
  }
})

const LeftContainer = styled(Animated.View)<{ margin: number; isVisible: boolean }>(
  ({ margin, isVisible }) => ({
    flex: 1,
    flexDirection: 'row',
    marginLeft: margin,
    alignItems: 'center',
    ...(isVisible ? {} : { display: 'none' }),
  })
)

const CenterContainer = styled.View<{ isDesktop?: boolean }>(({ theme, isDesktop }) => ({
  ...(isDesktop ? { minWidth: theme.breakpoints.lg } : {}),
  width: '100%',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: isDesktop ? 'center' : 'space-between',
  flex: 1,
}))

const RightContainer = styled(Animated.View)<{ margin: number; isVisible: boolean }>(
  ({ margin, isVisible }) => ({
    flex: 1,
    flexDirection: 'row',
    marginRight: margin,
    alignItems: 'center',
    ...(isVisible ? {} : { display: 'none' }),
  })
)

const FlexContainer = styled.View<{ alignItems?: string }>(({ alignItems }) => ({
  flex: 1,
  alignItems,
}))

const LogoContainer = styled(InternalTouchableLink)({
  flex: 1,
})

const LogoFrenchRepublicContainer = styled.View<{ width?: number; height?: number }>(
  ({ height, width }) => ({
    height: height ?? getSpacing(15),
    width,
  })
)
