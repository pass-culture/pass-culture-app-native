import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import React, { ReactNode, useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { ApiError } from 'api/ApiError'
import { isAPIExceptionCapturedAsInfo, isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum, ScreenError, AsyncError, MonitoringError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'

interface AsyncFallbackProps extends FallbackProps {
  resetErrorBoundary: (...args: Array<unknown>) => void
  error: AsyncError | ScreenError | Error
  header?: ReactNode
}

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION !
export const AsyncErrorBoundaryWithoutNavigation = ({
  resetErrorBoundary,
  error,
  header,
}: AsyncFallbackProps) => {
  const { reset } = useQueryErrorResetBoundary()
  const { logType } = useLogTypeFromRemoteConfig()

  useEffect(() => {
    const shouldCapturedApiErrorAsInfo = Boolean(
      error instanceof ApiError && isAPIExceptionCapturedAsInfo(error.statusCode)
    )
    const shouldApiErrorNotCaptured = Boolean(
      error instanceof ApiError && isAPIExceptionNotCaptured(error.statusCode)
    )
    if (shouldCapturedApiErrorAsInfo && logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(error.message, { level: logType })
    }
    // we already captures MonitoringError exceptions (in AsyncError constructor)
    // we don't need to capture those errors
    // we don't capture API errors 5xx
    const shouldCaptureError =
      !(error instanceof MonitoringError) &&
      !(error instanceof ScreenError) &&
      !shouldCapturedApiErrorAsInfo &&
      !shouldApiErrorNotCaptured

    if (shouldCaptureError) {
      eventMonitoring.captureException(error)
    }
  }, [error, logType])

  const handleRetry = async () => {
    reset()
    resetErrorBoundary()
    if (error instanceof AsyncError && error.retry) {
      await error.retry()
    }
  }

  if (error instanceof ScreenError) {
    return (
      <error.Screen resetErrorBoundary={resetErrorBoundary} callback={error.retry} error={error} />
    )
  }

  const helmetTitle = 'Page erreur\u00a0: Erreur pendant le chargement | pass Culture'

  return (
    <GenericErrorPage
      helmetTitle={helmetTitle}
      header={header}
      title="Oups&nbsp;!"
      subtitle="Une erreur s’est produite pendant le chargement."
      illustration={BicolorBrokenConnection}
      buttonPrimary={{ wording: 'Réessayer', onPress: handleRetry }}
    />
  )
}
