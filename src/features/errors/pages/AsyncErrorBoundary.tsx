import React, { ReactNode } from 'react'
import { FallbackProps } from 'react-error-boundary'
import styled from 'styled-components/native'

import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundaryWithoutNavigation'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
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
  const { goBack, canGoBack } = useGoBack(...homeNavConfig)
  const { top } = useCustomSafeInsets()

  return (
    <AsyncErrorBoundaryWithoutNavigation
      {...props}
      header={
        canGoBack() ? (
          <HeaderContainer
            onPress={goBack}
            top={top + getSpacing(3.5)}
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
