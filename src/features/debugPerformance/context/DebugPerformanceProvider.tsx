/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

import { shouldEnableDebugPerformance } from '../../../libs/debugPerformance/buildConfig'
import ConsoleInterface from '../console/ConsoleInterface'
import { MetricsCollector } from '../services/MetricsCollector'
import { StorageManager } from '../services/StorageManager'
import { PerformanceSession, DeviceInfo } from '../types'
import { DataCollector } from '../utils/dataCollector'
import { safeExecute, safeExecuteAsync } from '../utils/errorHandler'

export interface DebugPerformanceContextType {
  currentSession: PerformanceSession | null
  isRecording: boolean
  startRecording: () => Promise<boolean | undefined>
  stopRecording: () => Promise<boolean | undefined>
  pauseRecording: () => void
  resumeRecording: () => void
  clearAllData: () => Promise<void>
  getSessionStats: () => Promise<
    | {
        totalSessions: number
        currentSessionSize: number
        storageUsageMB: number
      }
    | undefined
  >
}

const DebugPerformanceContext = createContext<DebugPerformanceContextType | null>(null)

interface DebugPerformanceProviderProps {
  children: React.ReactNode
}

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const getDeviceInfo = (): DeviceInfo => {
  console.log('🔍 getDeviceInfo: Starting...')

  console.log('🔍 getDeviceInfo: Getting screen resolution...')
  const screenResolution = (() => {
    try {
      console.log('🔍 getDeviceInfo: Checking window and screen availability...')
      console.log('🔍 getDeviceInfo: typeof window:', typeof window)
      console.log(
        '🔍 getDeviceInfo: window.screen exists:',
        typeof window !== 'undefined' && !!window.screen
      )

      // React Native - try to get from Dimensions
      if (typeof window === 'undefined' || !window.screen) {
        console.log('🔍 getDeviceInfo: Using React Native defaults')
        // In React Native, we would import Dimensions from 'react-native'
        // For now, return safe defaults
        return { width: 375, height: 812 } // iPhone default
      }

      console.log('🔍 getDeviceInfo: Using window.screen')
      console.log('🔍 getDeviceInfo: window.screen:', window.screen)

      // Web - use window.screen
      const resolution = {
        width: window.screen?.width || 0,
        height: window.screen?.height || 0,
      }

      console.log('🔍 getDeviceInfo: Resolution computed:', resolution)
      return resolution
    } catch (error) {
      console.error('❌ getDeviceInfo: Error in screen resolution:', error)
      // Fallback to safe defaults
      return { width: 375, height: 812 }
    }
  })()

  console.log('✅ getDeviceInfo: Screen resolution obtained:', screenResolution)

  const platform = (() => {
    try {
      if (typeof window !== 'undefined') return 'web'
      // React Native platform detection
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        // Try to detect Android vs iOS in React Native
        const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent
        if (userAgent.includes('Android')) return 'android'
        return 'ios' // Default for React Native
      }
      return 'ios' // Fallback
    } catch (error) {
      return 'ios' // Safe fallback
    }
  })() as 'ios' | 'android' | 'web'

  return {
    platform,
    osVersion: (() => {
      try {
        return typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent || 'unknown'
      } catch (error) {
        return 'unknown'
      }
    })(),
    appVersion: '1.0.0', // Would come from app configuration
    screenResolution,
    memoryInfo: (() => {
      try {
        if (
          typeof navigator === 'undefined' ||
          typeof (navigator as any).deviceMemory === 'undefined'
        ) {
          return undefined
        }
        return {
          totalMemoryMB: (navigator as any).deviceMemory * 1024,
          availableMemoryMB: (navigator as any).deviceMemory * 1024 * 0.7, // Estimated
        }
      } catch (error) {
        return undefined
      }
    })(),
  }
}

export const DebugPerformanceProvider: React.FC<DebugPerformanceProviderProps> = ({ children }) => {
  // Early return if debug performance is disabled
  if (!shouldEnableDebugPerformance()) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const [currentSession, setCurrentSession] = useState<PerformanceSession | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const storageManager = useRef(StorageManager.getInstance())
  const dataCollector = useRef(DataCollector.getInstance())
  const metricsCollector = useRef(MetricsCollector.getInstance())
  const consoleInterface = useRef(ConsoleInterface.getInstance())

  const startRecording = useCallback(async (): Promise<boolean | undefined> => {
    return (
      safeExecuteAsync(
        async () => {
          console.log('🚀 DebugPerformanceProvider: startRecording called')

          if (isRecording) {
            console.log('✅ Already recording, returning true')
            return true // Already recording
          }

          console.log('📱 Generating session ID...')
          const sessionId = generateSessionId()
          console.log('✅ Session ID generated:', sessionId)

          console.log('🔍 Getting device info...')
          let deviceInfo
          try {
            console.log('🔍 Calling getDeviceInfo()...')
            deviceInfo = getDeviceInfo()
            console.log('✅ Device info obtained:', deviceInfo)
          } catch (error) {
            console.error('❌ Failed to get device info:', error)
            console.error('❌ Device info error stack:', (error as Error).stack)
            throw error
          }

          console.log('📦 Creating new session...')
          const newSession: PerformanceSession = {
            sessionId,
            startTime: Date.now(),
            deviceInfo,
            metrics: {
              networkRequests: [],
              renderEvents: [],
              listPerformance: [],
            },
            totalMemoryUsageMB: 0,
            status: 'active',
          }
          console.log('✅ Session created successfully')

          console.log('💾 Storing session...')
          const success = await storageManager.current.storeSession(sessionId, newSession)
          console.log(`💾 Storage result: ${success ? 'SUCCESS' : 'FAILED'}`)

          if (success) {
            console.log('🔧 Setting up session state...')
            setCurrentSession(newSession)
            setIsRecording(true)
            dataCollector.current.resumeProcessing()
            console.log('✅ Session state configured')

            // Start metrics collection
            console.log('🔄 Starting metrics collection...')
            try {
              const metricsStarted = await metricsCollector.current.startCollection(newSession)
              console.log(`🎯 Metrics collection result: ${metricsStarted ? 'SUCCESS' : 'FAILED'}`)
              if (!metricsStarted) {
                console.warn('⚠️ Some metrics collectors failed to start')
              }
            } catch (error) {
              console.error('❌ Metrics collection failed with error:', error)
            }
          } else {
            console.error('❌ Failed to store session')
          }

          console.log(`🏁 startRecording final result: ${success ? 'SUCCESS' : 'FAILED'}`)
          return success
        },
        'startRecording',
        false
      ) || false
    )
  }, [isRecording])

  const stopRecording = useCallback(async (): Promise<boolean | undefined> => {
    return (
      safeExecuteAsync(
        async () => {
          if (!isRecording || !currentSession) {
            return true // Already stopped
          }

          const updatedSession: PerformanceSession = {
            ...currentSession,
            endTime: Date.now(),
            status: 'completed',
          }

          const success = await storageManager.current.storeSession(
            currentSession.sessionId,
            updatedSession
          )
          if (success) {
            setCurrentSession(null)
            setIsRecording(false)
            dataCollector.current.pauseProcessing()

            // Stop metrics collection
            await metricsCollector.current.stopCollection()
          }

          return success
        },
        'stopRecording',
        false
      ) || false
    )
  }, [isRecording, currentSession])

  const pauseRecording = useCallback((): void => {
    safeExecute(() => {
      if (isRecording) {
        dataCollector.current.pauseProcessing()
        setIsRecording(false)
      }
    }, 'pauseRecording')
  }, [isRecording])

  const resumeRecording = useCallback((): void => {
    safeExecute(() => {
      if (currentSession && !isRecording) {
        dataCollector.current.resumeProcessing()
        setIsRecording(true)
      }
    }, 'resumeRecording')
  }, [currentSession, isRecording])

  const clearAllData = useCallback(async (): Promise<void> => {
    await safeExecuteAsync(async () => {
      await storageManager.current.clearAllData()
      dataCollector.current.clearQueue()
      setCurrentSession(null)
      setIsRecording(false)
    }, 'clearAllData')
  }, [])

  const getSessionStats = useCallback(async () => {
    return (
      safeExecuteAsync(
        async () => {
          const storageInfo = await storageManager.current.getStorageInfo()
          dataCollector.current.getQueueStats()
          const memoryUsage = dataCollector.current.getMemoryUsage()

          return {
            totalSessions: storageInfo.sessionCount,
            currentSessionSize: currentSession
              ? (() => {
                  try {
                    const jsonString = JSON.stringify(currentSession)
                    // React Native doesn't have Blob, use TextEncoder or estimate
                    if (typeof TextEncoder !== 'undefined') {
                      return new TextEncoder().encode(jsonString).length
                    }
                    // Fallback: estimate bytes (UTF-16, so roughly 2 bytes per char)
                    return jsonString.length * 2
                  } catch (error) {
                    return 1024 // 1KB fallback estimate
                  }
                })()
              : 0,
            storageUsageMB: storageInfo.totalSizeMB + memoryUsage.queueMemoryMB,
          }
        },
        'getSessionStats',
        {
          totalSessions: 0,
          currentSessionSize: 0,
          storageUsageMB: 0,
        }
      ) || {
        totalSessions: 0,
        currentSessionSize: 0,
        storageUsageMB: 0,
      }
    )
  }, [currentSession])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safeExecuteAsync(async () => {
        if (isRecording) {
          await stopRecording()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        await dataCollector.current.shutdown()
      }, 'cleanup')
    }
  }, [isRecording, stopRecording])

  // Initialize console interface with context
  useEffect(() => {
    const contextValue: DebugPerformanceContextType = {
      currentSession,
      isRecording,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      clearAllData,
      getSessionStats,
    }
    consoleInterface.current.initialize(contextValue)
  }, [
    currentSession,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearAllData,
    getSessionStats,
  ])

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue: DebugPerformanceContextType = {
    currentSession,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearAllData,
    getSessionStats,
  }

  return (
    <DebugPerformanceContext.Provider value={contextValue}>
      {children}
    </DebugPerformanceContext.Provider>
  )
}

export const useDebugPerformance = (): DebugPerformanceContextType => {
  const context = useContext(DebugPerformanceContext)

  if (!context) {
    // Return no-op implementation when context is not available
    return {
      currentSession: null,
      isRecording: false,
      startRecording: async () => false,
      stopRecording: async () => false,
      pauseRecording: () => {},
      resumeRecording: () => {},
      clearAllData: async () => {},
      getSessionStats: async () => ({
        totalSessions: 0,
        currentSessionSize: 0,
        storageUsageMB: 0,
      }),
    }
  }

  return context
}
