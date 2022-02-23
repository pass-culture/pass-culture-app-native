import React, { ComponentType, memo, useEffect, useMemo } from 'react'
import { withErrorBoundary, FallbackProps } from 'react-error-boundary'

import { AsyncErrorBoundary } from 'features/errors'
import { NotEligibleEduConnect } from 'features/identityCheck/errors/eduConnect/NotEligibleEduConnect'
import { eventMonitoring } from 'libs/monitoring'

import { EduConnectError } from './types'

interface EduConnectFallbackProps extends FallbackProps {
  error: EduConnectError | Error
  resetErrorBoundary: (...args: Array<unknown>) => void
}

export const EduConnectErrorBoundary = memo(function EduConnectErrorBoundary({
  error,
  resetErrorBoundary,
}: EduConnectFallbackProps) {
  useEffect(() => {
    if (error) {
      eventMonitoring.captureException(error)
    }
  }, [error])

  const EduConnectErrorPage = useMemo(
    () => (error instanceof EduConnectError ? NotEligibleEduConnect : AsyncErrorBoundary),
    [error]
  )

  return <EduConnectErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
})

export function withEduConnectErrorBoundary(component: ComponentType<unknown>) {
  return withErrorBoundary(memo(component), {
    FallbackComponent: EduConnectErrorBoundary,
  })
}
