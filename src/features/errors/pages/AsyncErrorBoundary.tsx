import React, { ReactNode, useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { AsyncError, MonitoringError, eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
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

  const helmetTitle = 'Page erreur\u00a0: Erreur pendant le chargement | pass Culture'
  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericErrorPage
        title="Oups&nbsp;!"
        icon={BrokenConnection}
        header={header}
        buttons={[
          <ButtonPrimaryWhite
            key={1}
            wording="Réessayer"
            onPress={handleRetry}
            buttonHeight="tall"
          />,
        ]}>
        <StyledBody>Une erreur s’est produite pendant le chargement.</StyledBody>
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
          <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="Revenir en arrière">
            <StyledArrowPrevious />
          </HeaderContainer>
        )
      }
    />
  )
}

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
  accessibilityLabel: 'Revenir en arrière',
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const BrokenConnection = styled(BicolorBrokenConnection).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``
