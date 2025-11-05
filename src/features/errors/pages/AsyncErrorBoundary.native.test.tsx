import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ApiError } from 'api/ApiError'
import { AsyncErrorBoundary } from 'features/errors/pages/AsyncErrorBoundary'
import { useMaintenance } from 'features/maintenance/helpers/useMaintenance/useMaintenance'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import * as useGoBack from 'features/navigation/useGoBack'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { AsyncError, LogTypeEnum, MonitoringError, ScreenError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/monitoring/services')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('features/maintenance/helpers/useMaintenance/useMaintenance')
const mockUseMaintenance = useMaintenance as jest.Mock

const user = userEvent.setup()
jest.useFakeTimers()

describe('AsyncErrorBoundary component', () => {
  beforeEach(() => setFeatureFlags())

  it('should render', () => {
    render(<AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should go back on back arrow press', async () => {
    render(<AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />)
    await user.press(screen.getByTestId('Revenir en arrière'))

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

    expect(retry).not.toHaveBeenCalled()

    await user.press(screen.getByText('Réessayer'))

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

    it('when error is not an error instance', () => {
      const plainErrorObject = {
        isComponentError: true,
        componentStack: 'in MyComponent (at App.js:10)',
      }

      render(
        <AsyncErrorBoundary
          error={plainErrorObject as unknown as Error}
          resetErrorBoundary={jest.fn()}
        />
      )

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('Captured non-error object'),
        {
          extra: { error: plainErrorObject },
        }
      )
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
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        },
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
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
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        },
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
