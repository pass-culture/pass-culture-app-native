import React from 'react'

import { RenderTracker } from '../services/RenderTracker'
import { logger } from '../utils/logger'

interface RenderProfilerProps {
  children: React.ReactNode
  id: string
  enabled?: boolean
}

export const RenderProfiler: React.FC<RenderProfilerProps> = ({ children, id, enabled = true }) => {
  const renderTracker = RenderTracker.getInstance()
  const isTracking = renderTracker.isCurrentlyTracking()

  logger.verbose('RenderProfiler', id, '- enabled:', enabled, '- tracking:', isTracking)

  if (!enabled) {
    logger.debug('RenderProfiler', id, 'disabled by props')
    return <React.Fragment>{children}</React.Fragment>
  }

  if (!isTracking) {
    logger.debug('RenderProfiler', id, 'tracking not active')
    return <React.Fragment>{children}</React.Fragment>
  }

  logger.verbose('RenderProfiler', id, 'ACTIVE - wrapping with React.Profiler')
  const callback = renderTracker.getOnRenderCallback()
  logger.verbose('Callback for', id, ':', callback)

  return (
    <React.Profiler id={id} onRender={callback}>
      {children}
    </React.Profiler>
  )
}
