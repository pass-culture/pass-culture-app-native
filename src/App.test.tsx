import { render } from '@testing-library/react-native'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { act } from 'react-test-renderer'

import { AsyncErrorBoundary } from 'features/errors'
import * as BatchLocalLib from 'libs/notifications'
import { flushAllPromises } from 'tests/utils'

import { App } from './App'

jest.mock('./libs/notifications', () => ({
  useStartBatchNotification: jest.fn(),
}))
jest.mock('features/navigation/RootNavigator', () => ({
  RootNavigator() {
    return 'Placeholder for RootNavigator'
  },
}))

describe('<App /> with mocked RootTabNavigator', () => {
  it('should render', async () => {
    const { toJSON } = await renderApp()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should call startBatchNotification() to optin to notifications', async () => {
    await renderApp()
    expect(BatchLocalLib.useStartBatchNotification).toHaveBeenCalled()
  })
})

describe('ErrorBoundary', () => {
  it('should display custom error page when children raise error', () => {
    // TODO (PC-6360) : console error displayed in DEV mode even if caught by ErrorBoundary
    const { getByText } = renderErrorBoundary()

    expect(getByText('Oops !')).toBeTruthy()
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
