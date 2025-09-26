import AsyncStorage from '@react-native-async-storage/async-storage'

import { logger } from '../utils/logger'
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

const STORAGE_PREFIX = '@debugPerformance/'
const SESSION_PREFIX = `${STORAGE_PREFIX}session/`
const METADATA_KEY = `${STORAGE_PREFIX}metadata`
const MAX_STORAGE_SIZE_MB = 100
const MAX_STORAGE_SIZE_BYTES = MAX_STORAGE_SIZE_MB * 1024 * 1024
const SESSION_EXPIRY_DAYS = 7
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000

interface StorageMetadata {
  totalSizeBytes: number
  sessionIds: string[]
  lastCleanup: number
}

interface SerializedData {
  timestamp: number
  data: any
  sizeBytes: number
}

export class StorageManager {
  private static instance: StorageManager
  private operationLock = false

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  private async withLock<T>(operation: () => Promise<T>): Promise<T> {
    while (this.operationLock) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    this.operationLock = true
    try {
      return await operation()
    } finally {
      this.operationLock = false
    }
  }

  private calculateSizeBytes(data: any): number {
    try {
      const jsonString = JSON.stringify(data)
      // React Native doesn't have Blob, use TextEncoder or estimate
      if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(jsonString).length
      }
      // Fallback: estimate bytes (UTF-16, so roughly 2 bytes per char)
      return jsonString.length * 2
    } catch (error) {
      logger.debug('Failed to calculate size, using fallback:', error)
      return 1024 // 1KB fallback estimate
    }
  }

  private async getMetadata(): Promise<StorageMetadata> {
    try {
      const metadataStr = await AsyncStorage.getItem(METADATA_KEY)
      if (!metadataStr) {
        return {
          totalSizeBytes: 0,
          sessionIds: [],
          lastCleanup: Date.now(),
        }
      }
      return JSON.parse(metadataStr)
    } catch (error) {
      logger.debug('Failed to get storage metadata:', error)
      return {
        totalSizeBytes: 0,
        sessionIds: [],
        lastCleanup: Date.now(),
      }
    }
  }

  private async setMetadata(metadata: StorageMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata))
    } catch (error) {
      logger.debug('Failed to set storage metadata:', error)
    }
  }

  private async cleanupExpiredSessions(): Promise<void> {
    const metadata = await this.getMetadata()
    const now = Date.now()

    // Only cleanup if it's been more than a day since last cleanup
    if (now - metadata.lastCleanup < 24 * 60 * 60 * 1000) {
      return
    }

    const validSessionIds: string[] = []
    let totalSize = 0

    for (const sessionId of metadata.sessionIds) {
      try {
        const sessionKey = `${SESSION_PREFIX}${sessionId}`
        const sessionDataStr = await AsyncStorage.getItem(sessionKey)

        if (sessionDataStr) {
          const sessionData: SerializedData = JSON.parse(sessionDataStr)
          const age = now - sessionData.timestamp

          if (age < SESSION_EXPIRY_MS) {
            validSessionIds.push(sessionId)
            totalSize += sessionData.sizeBytes
          } else {
            // Remove expired session
            await AsyncStorage.removeItem(sessionKey)
          }
        }
      } catch (error) {
        logger.debug(`Failed to process session ${sessionId}:`, error)
      }
    }

    await this.setMetadata({
      totalSizeBytes: totalSize,
      sessionIds: validSessionIds,
      lastCleanup: now,
    })
  }

  private async enforceStorageLimit(): Promise<void> {
    const metadata = await this.getMetadata()

    if (metadata.totalSizeBytes <= MAX_STORAGE_SIZE_BYTES) {
      // No action needed
      return
    }

    // Only log when we actually need to enforce limits
    logger.debug(
      `🗂️ Storage limit exceeded: ${Math.round(metadata.totalSizeBytes / (1024 * 1024))}MB > ${MAX_STORAGE_SIZE_MB}MB, cleaning up...`
    )

    // Remove oldest sessions until under limit
    const sortedSessions: Array<{ sessionId: string; timestamp: number; sizeBytes: number }> = []

    for (const sessionId of metadata.sessionIds) {
      try {
        const sessionKey = `${SESSION_PREFIX}${sessionId}`
        const sessionDataStr = await AsyncStorage.getItem(sessionKey)

        if (sessionDataStr) {
          const sessionData: SerializedData = JSON.parse(sessionDataStr)
          sortedSessions.push({
            sessionId,
            timestamp: sessionData.timestamp,
            sizeBytes: sessionData.sizeBytes,
          })
        }
      } catch (error) {
        logger.debug(`Failed to read session ${sessionId}:`, error)
      }
    }

    // Sort by timestamp (oldest first)
    sortedSessions.sort((a, b) => a.timestamp - b.timestamp)

    let currentSize = metadata.totalSizeBytes
    const remainingSessions: string[] = []

    // Remove oldest sessions first
    for (const session of sortedSessions) {
      if (currentSize <= MAX_STORAGE_SIZE_BYTES) {
        remainingSessions.push(session.sessionId)
      } else {
        try {
          await AsyncStorage.removeItem(`${SESSION_PREFIX}${session.sessionId}`)
          currentSize -= session.sizeBytes
        } catch (error) {
          logger.debug(`Failed to remove session ${session.sessionId}:`, error)
        }
      }
    }

    await this.setMetadata({
      totalSizeBytes: currentSize,
      sessionIds: remainingSessions,
      lastCleanup: Date.now(),
    })

    const removedCount = sortedSessions.length - remainingSessions.length
    if (removedCount > 0) {
      logger.debug(
        `🗑️ Removed ${removedCount} old sessions, now using ${Math.round(currentSize / (1024 * 1024))}MB`
      )
    }
  }

  async storeSession(sessionId: string, sessionData: any): Promise<boolean> {
    return this.withLock(async () => {
      try {
        await this.cleanupExpiredSessions()
        const sizeBytes = this.calculateSizeBytes(sessionData)

        const serializedData: SerializedData = {
          timestamp: Date.now(),
          data: sessionData,
          sizeBytes,
        }

        const sessionKey = `${SESSION_PREFIX}${sessionId}`
        const dataStr = JSON.stringify(serializedData)

        await AsyncStorage.setItem(sessionKey, dataStr)

        const metadata = await this.getMetadata()
        const updatedSessionIds = metadata.sessionIds.includes(sessionId)
          ? metadata.sessionIds
          : [...metadata.sessionIds, sessionId]

        await this.setMetadata({
          totalSizeBytes: metadata.totalSizeBytes + serializedData.sizeBytes,
          sessionIds: updatedSessionIds,
          lastCleanup: metadata.lastCleanup,
        })

        await this.enforceStorageLimit()

        return true
      } catch (error) {
        console.error('❌ StorageManager: Failed to store session:', error)
        logger.debug('Failed to store session:', error)
        return false
      }
    })
  }

  async getSession(sessionId: string): Promise<any | null> {
    return this.withLock(async () => {
      try {
        const sessionKey = `${SESSION_PREFIX}${sessionId}`
        const sessionDataStr = await AsyncStorage.getItem(sessionKey)

        if (!sessionDataStr) {
          return null
        }

        const sessionData: SerializedData = JSON.parse(sessionDataStr)
        const age = Date.now() - sessionData.timestamp

        if (age > SESSION_EXPIRY_MS) {
          await AsyncStorage.removeItem(sessionKey)
          return null
        }

        return sessionData.data
      } catch (error) {
        logger.debug('Failed to get session:', error)
        return null
      }
    })
  }

  async getAllSessions(): Promise<Array<{ sessionId: string; data: any }>> {
    return this.withLock(async () => {
      try {
        await this.cleanupExpiredSessions()
        const metadata = await this.getMetadata()
        const sessions: Array<{ sessionId: string; data: any }> = []

        for (const sessionId of metadata.sessionIds) {
          const sessionData = await this.getSession(sessionId)
          if (sessionData) {
            sessions.push({ sessionId, data: sessionData })
          }
        }

        return sessions
      } catch (error) {
        logger.debug('Failed to get all sessions:', error)
        return []
      }
    })
  }

  async clearAllData(): Promise<void> {
    return this.withLock(async () => {
      try {
        const metadata = await this.getMetadata()

        // Remove all session data
        for (const sessionId of metadata.sessionIds) {
          try {
            await AsyncStorage.removeItem(`${SESSION_PREFIX}${sessionId}`)
          } catch (error) {
            logger.debug(`Failed to remove session ${sessionId}:`, error)
          }
        }

        // Clear metadata
        await AsyncStorage.removeItem(METADATA_KEY)
      } catch (error) {
        logger.debug('Failed to clear all data:', error)
      }
    })
  }

  async getStorageInfo(): Promise<{
    totalSizeMB: number
    sessionCount: number
    lastCleanup: Date
  }> {
    const metadata = await this.getMetadata()
    return {
      totalSizeMB: Math.round((metadata.totalSizeBytes / (1024 * 1024)) * 100) / 100,
      sessionCount: metadata.sessionIds.length,
      lastCleanup: new Date(metadata.lastCleanup),
    }
  }
}
