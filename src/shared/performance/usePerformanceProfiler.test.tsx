/* eslint-disable no-restricted-imports */
import { act, renderHook } from '@testing-library/react-native'

import { PerformanceService, InteractionService } from './types'
import { usePerformanceProfiler } from './usePerformanceProfiler'

test('Démarre correctement la trace', async () => {
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn(),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn((callback) => {
      callback()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()

  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )

  await act(async () => {})

  expect(mockPerformanceService.sanitizeTraceName).toHaveBeenCalledWith('TestTrace')
  expect(mockPerformanceService.sanitizeMetricName).toHaveBeenCalledWith('mountDuration(in ms)')
  expect(mockStartTrace).toHaveBeenCalledWith('TestTrace')
})

test('Arrête correctement la trace', async () => {
  const mockStopTrace = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn(),
      stop: jest.fn(() => mockStopTrace()),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn((callback) => {
      callback()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()

  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )

  await act(async () => {})

  expect(mockStopTrace).toHaveBeenCalledWith()
})

test('Mesure le temps de montage', async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t, 1)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn((callback) => {
      callback()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()

  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )

  await act(async () => {})

  expect(mockPutMetric).toHaveBeenCalledWith('mountDuration(in ms)', 1)
  expect(mockPutMetric).toHaveBeenCalledWith('renderCount', 1)
  expect(mockPutMetric).toHaveBeenCalledWith('startupTime(in ms)', 1)
  expect(mockPutMetric).not.toHaveBeenCalledWith('navigationTime(in ms)')
})

test('Mesure le temps de navigation', async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn((callback) => {
      callback()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()
  const route = { params: { navigationStartTimeRef: Date.now() - 3 } }
  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
      route,
    })
  )

  await act(async () => {})

  expect(mockPutMetric).toHaveBeenNthCalledWith(3, 'navigationTime(in ms)')
  expect(mockPutMetric).not.toHaveBeenCalledWith('startupTime(in ms)')
})

test("Mesure le temps de démarrage de l'app", async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn((callback) => {
      callback()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()
  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )

  await act(async () => {})

  expect(mockPutMetric).not.toHaveBeenCalledWith('navigationTime(in ms)')
  expect(mockPutMetric).toHaveBeenCalledWith('startupTime(in ms)')
})

test('Mesure le démarrage en attendant la fin des interactions', async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const callbackAfterInteractions = jest.fn()
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn(() => {
      callbackAfterInteractions()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()
  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )

  await act(async () => {})

  expect(callbackAfterInteractions).toHaveBeenCalledWith()
})

test('Mesure la navigation en attendant la fin des interactions', async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const callbackAfterInteractions = jest.fn()
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn(() => {
      callbackAfterInteractions()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()
  const route = { params: { navigationStartTimeRef: Date.now() - 3 } }
  renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
      route,
    })
  )

  await act(async () => {})

  expect(callbackAfterInteractions).toHaveBeenCalledWith()
})

test("Mesure le temps d'éxécution d'une fonction", async () => {
  const mockPutMetric = jest.fn()
  const mockStartTrace = jest.fn(() =>
    Promise.resolve({
      putMetric: jest.fn((t) => mockPutMetric(t)),
      stop: jest.fn(),
    })
  )
  const mockPerformanceService: PerformanceService = {
    startTrace: mockStartTrace,
    sanitizeMetricName: jest.fn((t) => t),
    sanitizeTraceName: jest.fn((t) => t),
  }
  const callbackAfterInteractions = jest.fn()
  const mockInteractionService: InteractionService = {
    runAfterInteractions: jest.fn(() => {
      callbackAfterInteractions()
      return { cancel: jest.fn() }
    }),
  }
  const appStartTime = Date.now()
  const { result } = renderHook(() =>
    usePerformanceProfiler('TestTrace', {
      performanceService: mockPerformanceService,
      interactionService: mockInteractionService,
      appStartTime,
    })
  )
  await act(async () => {})

  const toTest = jest.fn()
  await result.current.measureExecutionTime({ fn: toTest, metricName: 'performance' })

  await act(async () => {})

  expect(toTest).toHaveBeenCalledWith()
  expect(mockPutMetric).toHaveBeenCalledWith('performance')
})
