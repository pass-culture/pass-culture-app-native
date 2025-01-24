import React from 'react'

import { ForceUpdateInfos } from 'features/forceUpdate/components/ForceUpdateInfos'
import { useResetOnMinimalBuild } from 'features/forceUpdate/helpers/useResetOnMinimalBuild'

type Props = {
  resetErrorBoundary: () => void
}

export const ForceUpdateWithResetErrorBoundary = ({ resetErrorBoundary }: Props) => {
  useResetOnMinimalBuild(resetErrorBoundary)
  return <ForceUpdateInfos />
}
