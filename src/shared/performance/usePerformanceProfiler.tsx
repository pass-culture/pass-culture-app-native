import { useRef, useCallback, useState, useEffect } from 'react'

import {
  PerformanceService,
  InteractionService,
  Route,
  Trace,
  Metric,
} from 'shared/performance/types'

interface UsePerformanceProfilerProps {
  performanceService: PerformanceService
  interactionService: InteractionService
  appStartTime: number
  route?: Route
  shouldProfile?: boolean
}

export const usePerformanceProfiler = (
  traceNameEx: string,
  {
    performanceService,
    interactionService,
    appStartTime,
    route,
    shouldProfile = true,
  }: UsePerformanceProfilerProps
) => {
  const mountStartTime = useRef<number>(Date.now())
  const isFirstMount = useRef<boolean>(true)
  const trace = useRef<Trace | null>(null)
  const renderCount = useRef<number>(0)
  const metricsToBeAddedOnTraceBeingAvailable = useRef<Metric[]>([])
  const [traceAvailable, setTraceAvailable] = useState<boolean>(false)
  const traceName = performanceService.sanitizeTraceName(traceNameEx)

  const startTracing = useCallback(async () => {
    if (shouldProfile) {
      try {
        trace.current = await performanceService.startTrace(traceName)
        setTraceAvailable(true)
      } catch (error) {
        console.error('Erreur lors du démarrage de la trace:', error)
      }
    }
  }, [traceName, shouldProfile, performanceService])

  const stopTracing = useCallback(() => {
    if (shouldProfile && trace.current) {
      try {
        trace.current.stop()
      } catch (error) {
        console.error("Erreur lors de l'arrêt de la trace:", error)
      }
    }
  }, [shouldProfile])

  const addMetric = useCallback(
    (metricName: string, value: number) => {
      if (shouldProfile) {
        const sanitizedMetricName = performanceService.sanitizeMetricName(metricName)

        if (trace.current) {
          try {
            trace.current.putMetric(sanitizedMetricName, value)
          } catch (error) {
            console.error("Erreur lors de l'ajout de la métrique:", error)
          }
        } else {
          metricsToBeAddedOnTraceBeingAvailable.current.push({
            metricName: sanitizedMetricName,
            value,
          })
        }
      }
    },
    [performanceService, shouldProfile]
  )

  const addOrIncrementRenderCountMetric = useCallback(() => {
    renderCount.current += 1
    addMetric('renderCount', renderCount.current)
  }, [addMetric])

  const addMetricsOnTraceAvailability = useCallback(() => {
    if (shouldProfile && trace.current) {
      metricsToBeAddedOnTraceBeingAvailable.current.forEach((item) => {
        try {
          trace.current?.putMetric(item.metricName, item.value)
        } catch (error) {
          console.error("Erreur lors de l'ajout de la métrique en attente:", error)
        }
      })
      metricsToBeAddedOnTraceBeingAvailable.current = []
    }
  }, [shouldProfile])

  // Mesure du temps de navigation
  const measureNavigationTime = useCallback(() => {
    if (shouldProfile && route?.params?.navigationStartTimeRef) {
      const navigationStartTime = route.params.navigationStartTimeRef
      const navigationTime = mountStartTime.current - navigationStartTime
      addMetric('navigationTime(in ms)', navigationTime)
    }
  }, [route, addMetric, shouldProfile])

  const measureTabLoadTime = useCallback(() => {
    if (shouldProfile && !route) {
      const task = interactionService.runAfterInteractions(() => {
        const renderEndTime = Date.now()
        const startupTime = renderEndTime - appStartTime
        addMetric('startupTime(in ms)', startupTime)
      })
      return () => task.cancel()
    }
    return undefined
  }, [shouldProfile, route, interactionService, appStartTime, addMetric])

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      startTracing()
    }

    return () => {
      stopTracing()
    }
  }, [startTracing, stopTracing])

  useEffect(() => {
    if (shouldProfile) {
      if (mountStartTime.current > 0) {
        const totalMountDuration = Date.now() - mountStartTime.current
        addMetric('mountDuration(in ms)', totalMountDuration)
      }
      addOrIncrementRenderCountMetric()
      measureNavigationTime()
      const cleanupMeasure = measureTabLoadTime()
      return () => {
        cleanupMeasure?.()
      }
    }
    return undefined
  }, [
    shouldProfile,
    addMetric,
    addOrIncrementRenderCountMetric,
    measureNavigationTime,
    measureTabLoadTime,
  ])

  // Effet pour ajouter les métriques mises en mémoire tampon lorsque la trace est disponible
  useEffect(() => {
    if (traceAvailable) {
      addMetricsOnTraceAvailability()
    }
  }, [traceAvailable, addMetricsOnTraceAvailability])

  // Effet pour arrêter la trace après les interactions et la disponibilité de la trace
  useEffect(() => {
    if (traceAvailable) {
      interactionService.runAfterInteractions(() => {
        stopTracing()
      })
    }
  }, [traceAvailable, stopTracing, interactionService])

  // Fonction pour mesurer le temps d'exécution d'une fonction asynchrone
  const measureExecutionTime = useCallback(
    async ({ fn, metricName }: { fn: () => Promise<unknown>; metricName: string }) => {
      const start = Date.now()
      try {
        const result = await fn()
        const end = Date.now()
        addMetric(metricName, end - start)
        return result
      } catch (error) {
        console.error("Erreur lors de l'exécution de la fonction:", error)
        throw error
      }
    },
    [addMetric]
  )

  return {
    mountStartTime: mountStartTime.current,
    addMetric,
    stopTrace: stopTracing,
    measureExecutionTime,
  }
}
