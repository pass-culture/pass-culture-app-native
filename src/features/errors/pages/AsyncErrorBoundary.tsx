import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { AsyncError, MonitoringError, eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericErrorPage } from 'ui/components/GenericErrorPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { Typo } from 'ui/theme'

interface AsyncFallbackProps extends FallbackProps {
  resetErrorBoundary: (...args: Array<unknown>) => void
  error: AsyncError | ScreenError | Error
  headerGoBack?: boolean
}

export const AsyncErrorBoundaryWithoutNavigation = ({
  resetErrorBoundary,
  error,
}: AsyncFallbackProps) => {
  const { reset } = useQueryErrorResetBoundary()

  useEffect(() => {
    if (
      // we already captures MonitoringError exceptions (in AsyncError constructor)
      !(error instanceof MonitoringError) ||
      // we don't need to capture those errors
      !(error instanceof ScreenError)
    ) {
      eventMonitoring.captureException(error)
    }
  }, [error])

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

  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Page erreur\u00a0: Erreur pendant le chargement` + ' | pass Culture'}</title>
      </Helmet>
      <GenericErrorPage
        title={t`Oups\u00a0!`}
        icon={BrokenConnection}
        headerGoBack
        buttons={[
          <ButtonPrimaryWhite
            key={1}
            wording={t`Réessayer`}
            onPress={handleRetry}
            buttonHeight="tall"
          />,
        ]}>
        <StyledBody>{t`Une erreur s'est produite pendant le chargement.`}</StyledBody>
      </GenericErrorPage>
    </React.Fragment>
  )
}

export const AsyncErrorBoundary = (props: AsyncFallbackProps) => {
  return <AsyncErrorBoundaryWithoutNavigation {...props} />
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
