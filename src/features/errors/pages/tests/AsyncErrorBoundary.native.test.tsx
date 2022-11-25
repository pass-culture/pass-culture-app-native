import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { AsyncError } from 'libs/monitoring'
import { render, fireEvent } from 'tests/utils'

import { AsyncErrorBoundary } from '../AsyncErrorBoundary'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('libs/monitoring/services')

describe('AsyncErrorBoundary component', () => {
  it('should render', () => {
    const resetErrorBoundary = jest.fn()
    const renderAPI = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go back on back arrow press', () => {
    const { getByTestId } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    fireEvent.press(getByTestId('Revenir en arrière'))
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should call retry with AsyncError', async () => {
    const resetErrorBoundary = jest.fn()
    const retry = jest.fn()
    const { findByText } = render(
      <AsyncErrorBoundary
        error={new AsyncError('error', retry)}
        resetErrorBoundary={resetErrorBoundary}
      />
    )
    const button = await findByText('Réessayer')
    expect(retry).not.toHaveBeenCalled()
    fireEvent.press(button)
    expect(retry).toHaveBeenCalledTimes(1)
  })
})

describe('Usage of AsyncErrorBoundary as fallback in ErrorBoundary', () => {
  it('should display custom error page when children raise error', () => {
    // TODO(PC-6360) : console error displayed in DEV mode even if caught by ErrorBoundary
    const { getByText } = renderErrorBoundary()

    expect(getByText('Oups\u00a0!')).toBeTruthy()
  })
})

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
