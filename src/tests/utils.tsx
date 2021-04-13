import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
// eslint-disable-next-line no-restricted-imports
import { render, RenderOptions } from '@testing-library/react-native'
import flushPromises from 'flush-promises'
import { fr } from 'make-plural/plurals'
import React from 'react'
import { act, ReactTestInstance } from 'react-test-renderer'

import { messages } from 'locales/fr/messages'

i18n.load({
  fr: messages,
})

i18n.loadLocaleData({
  fr: { plurals: fr },
})

i18n.activate('fr')

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

const LinguiProvider: React.FC = ({ children }) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
      {children}
    </I18nProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customRender = (ui: React.ReactElement<any>, options?: RenderOptions) =>
  render(ui, {
    wrapper: LinguiProvider,
    ...options,
  })

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react-native'

export { customRender as render }
