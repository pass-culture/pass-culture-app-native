/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18nProvider } from '@lingui/react'
import { render, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { i18n } from 'libs/i18n'

interface WrapWithProvidersAndRenderParams {
  Component: React.FunctionComponent<any>
  props?: Record<string, any>
}

export const wrapWithProvidersAndRender = ({
  Component,
  props = {},
}: WrapWithProvidersAndRenderParams): { component: RenderAPI } => {
  const WrappedComponent = (
    <I18nProvider language={i18n.language} i18n={i18n}>
      <Component {...props} />
    </I18nProvider>
  )

  return { component: render(WrappedComponent) }
}
