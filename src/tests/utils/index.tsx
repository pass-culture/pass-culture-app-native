import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import {
  act as renderHookAct,
  renderHook,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react-hooks'
import flushPromises from 'flush-promises'
import { fr } from 'make-plural/plurals'
import React from 'react'
import { Platform } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { ThemeProvider } from 'libs/styled/ThemeProvider'
import { messages } from 'locales/fr/messages'
import { theme } from 'theme'

import { act, render, RenderOptions } from './base'
export { act, cleanup, fireEvent, waitFor } from './base'

i18n.load({ fr: messages })
i18n.loadLocaleData({ fr: { plurals: fr } })
i18n.activate('fr')

export function accessibilityAndTestId(id: string) {
  return { accessible: true, accessibilityLabel: id, testID: id }
}

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

export async function superFlushWithAct(
  times = 50,
  otherAct: (callback: () => void) => void = act
) {
  await otherAct(async () => {
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

const computedTheme = {
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  appContentWidth: 960,
}

const DefaultWrapper: React.FC = ({ children }) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={{ ...theme, ...computedTheme }}>
        <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
          {children}
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

function customRender(ui: React.ReactElement<any>, options: RenderOptions = {}) {
  const { wrapper: Wrapper } = options
  const renderAPI = render(ui, {
    wrapper: Wrapper
      ? ({ children }) => (
          <DefaultWrapper>
            <Wrapper>{children}</Wrapper>
          </DefaultWrapper>
        )
      : DefaultWrapper,
    ...options,
  })
  renderAPI.toJSON = Platform.select({
    // @ts-expect-error : renderAPI.asFragment does exist on the web version of testing-library
    web: renderAPI.asFragment,
    native: renderAPI.toJSON,
  })
  return renderAPI
}
export { customRender as render }

async function customRenderHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P>
): Promise<RenderHookResult<P, R>> {
  const renderHookReturn = renderHook(callback, options)
  await superFlushWithAct(50, renderHookAct)
  return renderHookReturn
}
export { customRenderHook as renderHook }

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react-native'
