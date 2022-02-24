import { t } from '@lingui/macro'
import React, { useEffect, ReactNode } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { AsyncError, MonitoringError, eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericErrorPage } from 'ui/components/GenericErrorPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { ArrowPrevious as ArrowPreviousDefault } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface AsyncFallbackProps extends FallbackProps {
  resetErrorBoundary: (...args: Array<unknown>) => void
  error: AsyncError | ScreenError | Error
  header?: ReactNode
}

export const AsyncErrorBoundaryWithoutNavigation = ({
  resetErrorBoundary,
  error,
  header,
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
        header={header}
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
  const { goBack, canGoBack } = useGoBack(...homeNavConfig)
  const { top } = useCustomSafeInsets()

  return (
    <AsyncErrorBoundaryWithoutNavigation
      {...props}
      header={
        !!canGoBack() && (
          <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="backArrow">
            <ArrowPrevious />
          </HeaderContainer>
        )
      }
    />
  )
}

const ArrowPrevious = styled(ArrowPreviousDefault).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``

const HeaderContainer = styled.TouchableOpacity<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
