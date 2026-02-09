import React, { ComponentType } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { AsyncErrorBoundary } from 'features/errors/pages/AsyncErrorBoundary'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAsyncErrorBoundary = (component: ComponentType<any>) =>
  withErrorBoundary(React.memo(component), {
    FallbackComponent: AsyncErrorBoundary,
  })
