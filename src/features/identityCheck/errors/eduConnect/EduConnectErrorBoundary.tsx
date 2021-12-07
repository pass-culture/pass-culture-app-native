import React, { memo, useEffect, useMemo } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { AsyncErrorBoundary } from 'features/errors'
import { NotEligibleEduConnect } from 'features/identityCheck/errors/eduConnect/NotEligibleEduConnect'
import { eventMonitoring } from 'libs/monitoring'

import { EduConnectError, EduConnectErrors } from './types'

export interface EduConnectFallbackProps extends FallbackProps {
  error: EduConnectError | Error
  resetErrorBoundary: (...args: Array<unknown>) => void
}

export const EduConnectErrorBoundary = memo(function EduConnectErrorBoundary({
  error,
  resetErrorBoundary,
}: EduConnectFallbackProps) {
  const errorMonitoring = eventMonitoring

  useEffect(() => {
    if (error) {
      errorMonitoring.captureException(error)
    }
  }, [error, errorMonitoring])

  const EduConnectErrorPage = useMemo(
    () =>
      error instanceof EduConnectError && !!EduConnectErrors[error.errorCode]
        ? NotEligibleEduConnect
        : AsyncErrorBoundary,
    [error]
  )

  return <EduConnectErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
})
