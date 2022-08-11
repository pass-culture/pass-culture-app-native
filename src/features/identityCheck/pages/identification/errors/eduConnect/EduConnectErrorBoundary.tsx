import React, { ComponentType, memo, useEffect } from 'react'
import { withErrorBoundary, FallbackProps } from 'react-error-boundary'

import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
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
      if (error instanceof EduConnectError) {
        return
      }
      eventMonitoring.captureException(error)
    }
  }, [error])

  return <NotEligibleEduConnect error={error} resetErrorBoundary={resetErrorBoundary} />
})

export function withEduConnectErrorBoundary(component: ComponentType<unknown>) {
  return withErrorBoundary(memo(component), {
    FallbackComponent: EduConnectErrorBoundary,
  })
}
