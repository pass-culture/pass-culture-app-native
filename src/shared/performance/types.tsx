export interface Metric {
  metricName: string
  value: number
}

interface RouteParams {
  navigationStartTimeRef?: number
}

export interface Route {
  params?: RouteParams
}

export interface UsePerformanceProfilerOptions {
  route?: Route
  shouldProfile?: boolean
}

export interface PerformanceService {
  startTrace: (traceName: string) => Promise<Trace>
  sanitizeMetricName: (traceName: string) => string
  sanitizeTraceName: (traceName: string) => string
}

export interface Trace {
  putMetric: (metricName: string, value: number) => void
  stop: () => void
}

export interface InteractionService {
  runAfterInteractions: (callback: () => void) => { cancel: () => void }
}
