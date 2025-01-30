import React from 'react'

import { ForceUpdateInfos } from 'features/remoteBanner/components/ForceUpdateInfos'
import { useResetOnMinimalBuild } from 'features/remoteBanner/helpers/useResetOnMinimalBuild'

type Props = {
  resetErrorBoundary: () => void
}

export const ForceUpdateWithResetErrorBoundary = ({ resetErrorBoundary }: Props) => {
  useResetOnMinimalBuild(resetErrorBoundary)
  return <ForceUpdateInfos />
}
