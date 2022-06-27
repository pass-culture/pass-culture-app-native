import React, { Fragment, FunctionComponent } from 'react'
import styled, { DefaultTheme, ThemeProvider } from 'styled-components/native'

import { theme as baseTheme } from 'theme'
import { Typo } from 'ui/theme'

type DimensionProps = {
  width: number
  height: number
}

type Props = DimensionProps & {
  caption: string
  theme: DefaultTheme
}

const Viewport = styled.View<DimensionProps>(({ width, height }) => ({
  width,
  height,
  boxSizing: 'content-box',
  border: 'solid black 1px',
}))

const viewport = ({ caption, theme, width, height }: Props) => {
  const WrappedComponent: FunctionComponent = (props) => (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Viewport width={width} height={height} {...props} />
      </ThemeProvider>
      <Typo.Caption>{caption}</Typo.Caption>
    </Fragment>
  )
  return WrappedComponent
}

const defaultTheme = {
  ...baseTheme,
  isMobileViewport: false,
  isTabletViewport: false,
  isDesktopViewport: false,
  isSmallScreen: false,
  showTabBar: false,
  appContentWidth: 320,
}

export const StoryViewport = {
  SmallPhone: viewport({
    caption: 'Small phone',
    theme: {
      ...defaultTheme,
      isMobileViewport: true,
      showTabBar: true,
    },
    width: 320,
    height: baseTheme.minScreenHeight,
  }),
  Phone: viewport({
    caption: 'Phone',
    theme: {
      ...defaultTheme,
      isMobileViewport: true,
      showTabBar: true,
      appContentWidth: baseTheme.breakpoints.sm,
    },
    width: baseTheme.breakpoints.sm,
    height: (baseTheme.breakpoints.sm * 16) / 9,
  }),
  Tablet: viewport({
    caption: 'Tablet',
    theme: {
      ...defaultTheme,
      isTabletViewport: true,
      showTabBar: true,
      appContentWidth: baseTheme.breakpoints.md,
    },
    width: baseTheme.breakpoints.md,
    height: (baseTheme.breakpoints.md * 16) / 9,
  }),
  Desktop: viewport({
    caption: 'Desktop',
    theme: {
      ...defaultTheme,
      isDesktopViewport: true,
      appContentWidth: baseTheme.breakpoints.lg,
    },
    width: baseTheme.breakpoints.lg,
    height: (baseTheme.breakpoints.lg * 9) / 16,
  }),
}
