// We importe setImmediate here since it is defined only in node environment and since Jest 27, web tests in jsdom environment
// can not read setImmediate so we import it
// https://github.com/prisma/prisma/issues/8558#issuecomment-1040378575

// eslint-disable-next-line no-restricted-imports
import { render } from '@testing-library/react-native'
import deepmerge from 'deepmerge'
import React, { PropsWithChildren, ReactNode } from 'react'
import { act, ReactTestInstance } from 'react-test-renderer'
import { measurePerformance } from 'reassure'
import { ThemeProvider as ThemeProviderWeb, DefaultTheme } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'

import { computedTheme } from './computedTheme'

export async function simulateWebviewMessage(webview: ReactTestInstance, message: string) {
  await act(async () => {
    webview.props.onMessage({
      nativeEvent: { data: message },
    })
  })
}

type PropsWithTheme = {
  theme?: Partial<DefaultTheme>
  children?: ReactNode
}

const DefaultWrapper = ({ theme, children }: PropsWithTheme) => {
  return (
    // ThemeProviderWeb is useful to recycle .test.tsx for both native and web
    <ThemeProviderWeb theme={deepmerge(computedTheme, theme || {})}>
      <ThemeProvider theme={deepmerge(computedTheme, theme || {})}>
        <IconFactoryProvider>{children}</IconFactoryProvider>
      </ThemeProvider>
    </ThemeProviderWeb>
  )
}

type RenderOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper?: React.ComponentType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createNodeMock?: (element: React.ReactElement) => any
}

export type CustomRenderOptions = {
  theme?: Partial<DefaultTheme>
} & RenderOptions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customRender(ui: React.ReactElement<any>, options?: CustomRenderOptions) {
  const { wrapper: Wrapper, theme, ...restOfOptions } = options || {}
  return render(ui, {
    wrapper: Wrapper
      ? ({ children }) => (
          <DefaultWrapper theme={theme}>
            <Wrapper>{children}</Wrapper>
          </DefaultWrapper>
        )
      : ({ children }) => <DefaultWrapper theme={theme}>{children}</DefaultWrapper>,
    ...restOfOptions,
  })
}

type MeasureOptions = Parameters<typeof measurePerformance>[1]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customMeasurePerformance(ui: React.ReactElement<any>, options?: MeasureOptions) {
  const { wrapper, ...restOfOptions } = options || {}
  const Wrapper = wrapper as React.ComponentType<PropsWithChildren>
  return measurePerformance(ui, {
    wrapper: Wrapper
      ? (children) => (
          <DefaultWrapper>
            <Wrapper>{children}</Wrapper>
          </DefaultWrapper>
        )
      : (children) => <DefaultWrapper>{children}</DefaultWrapper>,
    ...restOfOptions,
  })
}

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react-native'

export { customRender as render }
export { customMeasurePerformance as measurePerformance }

export const middleScrollEvent = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 },
    contentSize: { height: 1600 },
  },
}

export const bottomScrollEvent = {
  nativeEvent: {
    contentOffset: { y: 1600 },
    layoutMeasurement: { height: 1600 },
    contentSize: { height: 1600 },
  },
}
