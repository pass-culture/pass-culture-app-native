import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { act } from 'react-test-renderer'

import { AsyncErrorBoundary } from 'features/errors'
import * as BatchLocalLib from 'libs/notifications'
import { flushAllPromises, render } from 'tests/utils/web'

import { App } from './App'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('./libs/notifications', () => ({
  useStartBatchNotification: jest.fn(),
}))

jest.mock('features/navigation/RootNavigator', () => ({
  RootNavigator: () => 'Placeholder for RootNavigator',
}))
jest.mock('features/navigation/RootNavigator/routes', () => ({
  linking: { prefixes: [], config: { screens: [] } },
}))

describe('<App /> with mocked RootNavigator', () => {
  it('should call startBatchNotification() to optin to notifications', async () => {
    await renderApp()
    expect(BatchLocalLib.useStartBatchNotification).toHaveBeenCalled()
  })
})

describe('ErrorBoundary', () => {
  it('should display custom error page when children raise error', () => {
    // TODO (PC-6360) : console error displayed in DEV mode even if caught by ErrorBoundary
    const { getByText } = renderErrorBoundary()

    expect(getByText('Oups !')).toBeTruthy()
  })
})

const renderApp = async () => {
  const wrapper = render(<App />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

function ComponentWithError() {
  useEffect(() => {
    throw new Error()
  }, [])
  return <React.Fragment />
}

const renderErrorBoundary = () => {
  return render(
    <ErrorBoundary FallbackComponent={AsyncErrorBoundary}>
      <ComponentWithError />
    </ErrorBoundary>
  )
}
