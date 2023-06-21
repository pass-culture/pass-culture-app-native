import React from 'react'

import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'
import { eventMonitoring } from 'libs/monitoring'
import { render } from 'tests/utils'

jest.mock('react-query')

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
