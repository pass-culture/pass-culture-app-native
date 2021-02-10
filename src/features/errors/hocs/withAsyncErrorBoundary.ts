import React, { ComponentType } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { AsyncErrorBoundary } from '../pages/AsyncErrorBoundary'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAsyncErrorBoundary(component: ComponentType<any>) {
  return withErrorBoundary(React.memo(component), {
    FallbackComponent: AsyncErrorBoundary,
  })
}
