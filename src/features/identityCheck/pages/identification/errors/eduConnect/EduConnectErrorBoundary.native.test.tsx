import React from 'react'

import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'
import { eventMonitoring } from 'libs/monitoring'
import { render } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('EduConnectErrorBoundary component', () => {
  it('should not log error on sentry when error is an expected EduConnectError', () => {
    render(
      <EduConnectErrorBoundary
        error={new EduConnectError('expected error')}
        resetErrorBoundary={jest.fn()}
      />
    )

    expect(eventMonitoring.captureException).not.toHaveBeenCalled()
  })

  it('should log error on sentry when error is not an EduConnectError', () => {
    const error = new Error('some error')
    render(<EduConnectErrorBoundary error={error} resetErrorBoundary={jest.fn()} />)

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
  })
})
