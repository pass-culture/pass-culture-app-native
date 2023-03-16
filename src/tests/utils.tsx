// We importe setImmediate here since it is defined only in node environment and since Jest 27, web tests in jsdom environment
// can not read setImmediate so we import it
// https://github.com/prisma/prisma/issues/8558#issuecomment-1040378575
import { setImmediate } from 'timers'

// eslint-disable-next-line no-restricted-imports
import { render, waitFor as defaultWaitFor } from '@testing-library/react-native'
import deepmerge from 'deepmerge'
import flushPromises from 'flush-promises'
import React, { ReactNode } from 'react'
import { act, ReactTestInstance } from 'react-test-renderer'
import { ThemeProvider as ThemeProviderWeb, DefaultTheme } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { computedTheme } from './computedTheme'

// TODO(PC-20887): Investigate how to avoid timeouts in CI without increasing default timeout
export const WAIT_FOR_TIMEOUT_IN_MS = 10_000

export async function flushAllPromises() {
  await flushPromises()
  return new Promise((resolve) => setImmediate(resolve))
}

/**
  __Warning__ : avoid usage of this function as much as possible.

  Usecase : when you get the "state update not wrapped in act" warning
  no matter what you do.
  @param times number of times you want to call `flushAllPromises()`. Increment `times` until the warning disappears.
*/
export async function flushAllPromisesTimes(times: number) {
  for (let i = 0; i < times; i++) {
    await flushAllPromises()
  }
}

export const useMutationFactory = (storageFunction: {
  onError: (error: unknown) => void
  onSuccess: () => void
}) => {
  const mutate = jest.fn()
  return (
    mutationFunction: () => void,
    mutationOptions: { onError: () => void; onSuccess: () => void }
  ) => {
    storageFunction.onError = mutationOptions?.onError
    storageFunction.onSuccess = mutationOptions?.onSuccess
    return {
      mutationFunction,
      mutationOptions,
      mutate,
    }
  }
}

export async function flushAllPromisesWithAct() {
  await act(async () => {
    await flushAllPromises()
  })
}

export async function superFlushWithAct(times = 50) {
  await act(async () => {
    await flushAllPromisesTimes(times)
  })
}

export function simulateWebviewMessage(webview: ReactTestInstance, message: string) {
  act(() => {
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
      <ThemeProvider theme={deepmerge(computedTheme, theme || {})}>{children}</ThemeProvider>
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

export function waitFor(cb: () => void, opts = {}): Promise<void> {
  // Default timeout was changed in the new version of @testing-library/react-native,
  // but we need the old value for our tests (especially for navigation)
  return defaultWaitFor(cb, { ...opts, timeout: WAIT_FOR_TIMEOUT_IN_MS })
}

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react-native'

export { customRender as render }

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
