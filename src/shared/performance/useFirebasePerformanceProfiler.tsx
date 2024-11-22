import perf from '@react-native-firebase/perf'
import { InteractionManager } from 'react-native'

import { useAppStartTimeStore } from 'shared/performance/appStartTimeStore'
import { usePerformanceProfiler } from 'shared/performance/usePerformanceProfiler'

import { Route } from './types'

function sanitizeName(name: string, length: number): string {
  // Supprimer les espaces en début et fin
  let sanitized = name.trim()
  // Supprimer les underscores au début et à la fin
  sanitized = sanitized.replace(/(^_+)|(_+$)/g, '')
  // Tronquer à 32 caractères maximum
  if (sanitized.length > length) {
    sanitized = sanitized.substring(0, length)
  }
  return sanitized
}
export function sanitizeMetricName(name: string): string {
  return sanitizeName(name, 32)
}

export function sanitizeTraceName(name: string): string {
  return sanitizeName(name, 100)
}

type useFirebasePerformanceProfilerProps = {
  route?: Route
  shouldProfile?: boolean
}

export const useFirebasePerformanceProfiler = (
  traceName: string,
  props?: useFirebasePerformanceProfilerProps
) => {
  const { route = undefined, shouldProfile = true } = props || {}
  const performanceService = {
    startTrace: async (identifier: string) => perf().startTrace(identifier),
    sanitizeMetricName: sanitizeMetricName,
    sanitizeTraceName: sanitizeTraceName,
  }

  const interactionService = {
    runAfterInteractions: InteractionManager.runAfterInteractions,
  }

  const { appStartTime } = useAppStartTimeStore()

  // Utilisation du hook de performance pour mesurer les délais
  return usePerformanceProfiler(traceName, {
    performanceService,
    interactionService,
    appStartTime,
    route,
    shouldProfile,
  })
}
