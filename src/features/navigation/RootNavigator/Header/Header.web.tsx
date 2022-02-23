import React, { useRef, useEffect, memo } from 'react'
import { Animated } from 'react-native'
import webStyled from 'styled-components'
import styled, { useTheme } from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getShadow, getSpacing } from 'ui/theme'
import { Link } from 'ui/web/link/Link'

import { AccessibleTabBar } from './AccessibleTabBar'
import { Nav } from './Nav'

const MINIMUM_BRAND_SIZE = 140

/* eslint-disable @typescript-eslint/no-unused-vars */
export const Header = memo(function Header() {
  const theme = useTheme()

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
  }, [isBrandVisible])

  if (theme.showTabBar) {
    return <AccessibleTabBar />
  }
  return (
    <HeaderContainer>
      <LeftContainer margin={margin} isVisible={!!isDesktopOffset} style={fadeAnim}>
        <LogoContainer onPress={navigateToHome}>
          {!!isBrandVisible && (
            <Link to={{ screen: homeNavConfig[0], params: homeNavConfig[1] }} accessible={false}>
              <LogoPassCulture
                color={theme.uniqueColors.brand}
                height={getSpacing(10)}
                width="100%"
              />
            </Link>
          )}
        </LogoContainer>
        <FlexContainer />
      </LeftContainer>
      <CenterContainer isDesktop={theme.isDesktopViewport}>
        <LeftContainer margin={margin} isVisible={true} style={fadeAnimSmall}>
          <LogoPassCulture color={theme.uniqueColors.brand} height={getSpacing(6.5)} width={80} />
        </LeftContainer>
        <Nav
          maxWidth={theme.appContentWidth}
          height={theme.navTopHeight}
          noShadow={theme.isDesktopViewport}
        />
        <RightContainer margin={margin} isVisible={true} style={fadeAnimSmall}>
          <FlexContainer alignItems="flex-end">
            <LogoMinistereContainer height={getSpacing(11)} width={getSpacing(15.5)}>
              <LogoMinistere />
            </LogoMinistereContainer>
          </FlexContainer>
        </RightContainer>
      </CenterContainer>
      <RightContainer margin={margin} isVisible={!!isDesktopOffset} style={fadeAnim}>
        <FlexContainer />
        <FlexContainer>
          <LogoMinistereContainer>
            <LogoMinistere />
          </LogoMinistereContainer>
        </FlexContainer>
      </RightContainer>
    </HeaderContainer>
  )
})

const HeaderContainer = webStyled.header(({ theme }) => {
  return {
    display: 'flex',
    flexGrow: 1,
    maxHeight: theme.navTopHeight,
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
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

const LogoContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  flex: 1,
})

const LogoMinistereContainer = styled.View<{ width?: number; height?: number }>(
  ({ height, width }) => ({
    height: height ?? getSpacing(15),
    width,
  })
)
