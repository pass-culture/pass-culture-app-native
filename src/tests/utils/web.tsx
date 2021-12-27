import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
// eslint-disable-next-line no-restricted-imports
import { act, render, RenderOptions } from '@testing-library/react'
import flushPromises from 'flush-promises'
import { fr } from 'make-plural/plurals'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { ThemeProvider } from 'libs/styled/ThemeProvider'
import { messages } from 'locales/fr/messages'
import { computedTheme } from 'tests/computedTheme'

i18n.load({
  fr: messages,
})

i18n.loadLocaleData({
  fr: { plurals: fr },
})

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

const DefaultWrapper: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={computedTheme}>
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customRender(ui: React.ReactElement<any>, options?: RenderOptions) {
  const { wrapper: Wrapper, ...restOfOptions } = options || {}
  return render(ui, {
    wrapper: Wrapper
      ? ({ children }) => (
          <DefaultWrapper>
            <Wrapper>{children}</Wrapper>
          </DefaultWrapper>
        )
      : DefaultWrapper,
    ...restOfOptions,
  })
}

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react'

export { customRender as render }
