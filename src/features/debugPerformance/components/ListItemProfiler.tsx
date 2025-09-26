import React from 'react'

import { listMonitor } from '../services/ListMonitor'

interface ListItemProfilerProps {
  children: React.ReactNode
  listId: string
  itemId: string
  enabled?: boolean
}

export const ListItemProfiler: React.FC<ListItemProfilerProps> = ({
  children,
  listId,
  itemId,
  enabled = true,
}) => {
  if (!enabled) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const callback = listMonitor.getRenderProfilerCallback(listId)

  if (!callback) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const profilerId = `${listId}_item_${itemId}`

  return (
    <React.Profiler id={profilerId} onRender={callback}>
      {children}
    </React.Profiler>
  )
}

interface ListContainerProfilerProps {
  children: React.ReactNode
  listId: string
  enabled?: boolean
}

export const ListContainerProfiler: React.FC<ListContainerProfilerProps> = ({
  children,
  listId,
  enabled = true,
}) => {
  if (!enabled) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const callback = listMonitor.getRenderProfilerCallback(listId)

  if (!callback) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const profilerId = `${listId}_container`

  return (
    <React.Profiler id={profilerId} onRender={callback}>
      {children}
    </React.Profiler>
  )
}
