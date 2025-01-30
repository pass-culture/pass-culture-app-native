import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ApiError } from 'api/ApiError'
import { useMaintenance } from 'features/maintenance/helpers/useMaintenance/useMaintenance'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import * as useGoBack from 'features/navigation/useGoBack'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { AsyncError, MonitoringError, ScreenError, LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { fireEvent, render, screen } from 'tests/utils'

import { AsyncErrorBoundary } from './AsyncErrorBoundary'

jest.mock('libs/monitoring/services')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('features/maintenance/helpers/useMaintenance/useMaintenance')
const mockUseMaintenance = useMaintenance as jest.Mock

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
      <AsyncErrorBoundary
        error={new AsyncError('error', { retry, logType: LogTypeEnum.ERROR })}
        resetErrorBoundary={jest.fn()}
      />
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

  it.each([
    401, // Unauthorized
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should not capture error exception when error is ApiError and error code is %s',
    (statusCode) => {
      const error = new ApiError(statusCode, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).not.toHaveBeenCalledWith(error)
    }
  )

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      })
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should capture info when error is ApiError and error code is 401', () => {
      const error = new ApiError(401, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error.message, {
        level: 'info',
      })
    })
  })

  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: false,
      })
    })

    it('should not capture info when error is ApiError and error code is 401', () => {
      const error = new ApiError(401, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('should not capture info', () => {
    it('when error is MonitoringError', () => {
      const error = new MonitoringError('error')
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).not.toHaveBeenCalledWith(error.message, {
        level: 'info',
      })
    })

    it('when error is ApiError and error code is 400', () => {
      const error = new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).not.toHaveBeenCalledWith(error.message, {
        level: 'info',
      })
    })
  })

  describe('should not capture exception', () => {
    it('two times when error is MonitoringError', () => {
      const error = new MonitoringError('error')
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(1, error, undefined)
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
    })

    it('when error is ScreenError and log type is ignored', () => {
      const error = new ScreenError('error', {
        Screen: MaintenanceErrorPage,
        logType: LogTypeEnum.IGNORED,
      })
      mockUseMaintenance.mockReturnValueOnce(error)
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })
  })

  describe('should capture message', () => {
    it('when error is ScreenError and log type is info', () => {
      const error = new ScreenError('error-1', {
        Screen: MaintenanceErrorPage,
        logType: LogTypeEnum.INFO,
      })
      mockUseMaintenance.mockReturnValueOnce(error)
      render(<AsyncErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith('error-1', { level: 'info' })
    })
  })
})

describe('Usage of AsyncErrorBoundary as fallback in ErrorBoundary', () => {
  it('should display custom error page when children raise error', () => {
    // Console error displayed in DEV mode even if caught by ErrorBoundary
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)

    renderErrorBoundary()

    expect(screen.getByText('Oups\u00a0!')).toBeOnTheScreen()
  })
})

function ComponentWithError() {
  useEffect(() => {
    throw new Error()
  }, [])
  return null
}

const renderErrorBoundary = () => {
  return render(
    <ErrorBoundary FallbackComponent={AsyncErrorBoundary}>
      <ComponentWithError />
    </ErrorBoundary>
  )
}
