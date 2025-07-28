// We importe setImmediate here since it is defined only in node environment and since Jest 27, web tests in jsdom environment
// can not read setImmediate so we import it
// https://github.com/prisma/prisma/issues/8558#issuecomment-1040378575

// eslint-disable-next-line no-restricted-imports
import { render, RenderOptions } from '@testing-library/react'
import deepmerge from 'deepmerge'
import React, { ReactNode } from 'react'
import { ThemeProvider as ThemeProviderWeb, DefaultTheme } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { StylesheetManagerWrapper } from 'libs/styled/StyleSheetManagerWrapper'
import { computedTheme } from 'tests/computedTheme'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'

type PropsWithTheme = {
  theme?: Partial<DefaultTheme>
  children?: ReactNode
}

const DefaultWrapper = ({ children, theme }: PropsWithTheme) => {
  const innerTheme = deepmerge(computedTheme, theme || {})
  return (
    <ThemeProviderWeb theme={innerTheme}>
      <ThemeProvider theme={innerTheme}>
        <StylesheetManagerWrapper>
          <IconFactoryProvider>{children}</IconFactoryProvider>
        </StylesheetManagerWrapper>
      </ThemeProvider>
    </ThemeProviderWeb>
  )
}

type CustomRenderOptions = {
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

// eslint-disable-next-line no-restricted-imports
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'

export { axe as checkAccessibilityFor } from 'jest-axe'

export { customRender as render }
