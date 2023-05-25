import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ApiError } from 'api/apiHelpers'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { AsyncError, MonitoringError, ScreenError, eventMonitoring } from 'libs/monitoring'
import { render, fireEvent, screen } from 'tests/utils'

import { AsyncErrorBoundary } from './AsyncErrorBoundary'

jest.mock('libs/monitoring/services')

describe('AsyncErrorBoundary component', () => {
  it('should render', () => {
    render(<AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />)
    expect(screen).toMatchSnapshot()
  })

  it('should go back on back arrow press', () => {
    render(<AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />)
    fireEvent.press(screen.getByTestId('Revenir en arrière'))
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should call retry with AsyncError', async () => {
    const retry = jest.fn()
    render(
      <AsyncErrorBoundary error={new AsyncError('error', retry)} resetErrorBoundary={jest.fn()} />
    )
    const button = await screen.findByText('Réessayer')
    expect(retry).not.toHaveBeenCalled()
    fireEvent.press(button)
    expect(retry).toHaveBeenCalledTimes(1)
  })

  describe('should capture exception', () => {
    it('when error is Error', () => {
      render(<AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />)
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })

    it('when error is ApiError and error code is 400', () => {
      const error = new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('should not capture exception', () => {
    it('two times when error is MonitoringError', () => {
      const error = new MonitoringError('error')
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)
      expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(1, error, undefined)
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
    })

    it('when error is ScreenError', () => {
      render(
        <AsyncErrorBoundary
          error={new ScreenError('error', MaintenanceErrorPage)}
          resetErrorBoundary={jest.fn()}
        />
      )
      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })

    it('when error is ApiError and error code is 5xx', () => {
      const error = new ApiError(500, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)
      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })
  })
})

describe('Usage of AsyncErrorBoundary as fallback in ErrorBoundary', () => {
  it('should display custom error page when children raise error', () => {
    // Console error displayed in DEV mode even if caught by ErrorBoundary
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)

    renderErrorBoundary()

    expect(screen.getByText('Oups\u00a0!')).toBeTruthy()
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
