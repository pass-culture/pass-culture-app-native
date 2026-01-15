import React, { ReactNode } from 'react'
import { FallbackProps } from 'react-error-boundary'
import styled, { useTheme } from 'styled-components/native'

import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundaryWithoutNavigation'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ScreenError, AsyncError } from 'libs/monitoring/errors'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface AsyncFallbackProps extends FallbackProps {
  resetErrorBoundary: (...args: Array<unknown>) => void
  error: AsyncError | ScreenError | Error
  header?: ReactNode
}

export const AsyncErrorBoundary = (props: AsyncFallbackProps) => {
  const { goBack, canGoBack } = useGoBack(...homeNavigationConfig)
  const { top } = useCustomSafeInsets()
  const { designSystem } = useTheme()

  return (
    <AsyncErrorBoundaryWithoutNavigation
      {...props}
      header={
        canGoBack() ? (
          <HeaderContainer
            onPress={goBack}
            top={top + designSystem.size.spacing.l}
            accessibilityLabel="Revenir en arrière">
            <StyledArrowPrevious />
          </HeaderContainer>
        ) : null
      }
    />
  )
}

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
  size: theme.icons.sizes.small,
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))
