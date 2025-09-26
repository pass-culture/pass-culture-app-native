import type { NetworkRequest } from '../types'
import { logger } from '../utils/logger'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { StorageManager } from './StorageManager'

interface NetworkStorageMetadata {
  totalNetworkRequests: number
  oldestRequestTimestamp: number
  newestRequestTimestamp: number
  requestsByCategory: Record<string, number>
  sizeBytesByCategory: Record<string, number>
}

export class NetworkStorage {
  private static instance: NetworkStorage
  private storageManager: StorageManager
  private currentSessionId: string
  private networkRequests: NetworkRequest[] = []
  private readonly maxRequestsInMemory = 1000
  private readonly batchSize = 50

  private constructor() {
    this.storageManager = StorageManager.getInstance()
    this.currentSessionId = this.generateSessionId()
  }

  static getInstance(): NetworkStorage {
    if (!NetworkStorage.instance) {
      NetworkStorage.instance = new NetworkStorage()
    }
    return NetworkStorage.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Store a network request in the circular buffer
   */
  async storeNetworkRequest(request: NetworkRequest): Promise<boolean> {
    try {
      // Add to in-memory buffer
      this.networkRequests.push({
        ...request,
        sessionId: this.currentSessionId,
      })

      // Maintain memory limit
      if (this.networkRequests.length > this.maxRequestsInMemory) {
        // Flush older requests to storage before removing from memory
        await this.flushBatchToStorage()
      }

      return true
    } catch (error) {
      logger.debug('Failed to store network request:', error)
      return false
    }
  }

  /**
   * Flush network requests to persistent storage in batches
   */
  private async flushBatchToStorage(): Promise<void> {
    if (this.networkRequests.length === 0) return

    const batchToFlush = this.networkRequests.splice(0, this.batchSize)

    try {
      // Get existing session data
      const existingData = await this.storageManager.getSession(this.currentSessionId)
      const sessionData = {
        ...existingData,
        networkRequests: existingData?.networkRequests || [],
        metadata: existingData?.metadata || this.createEmptyMetadata(),
      }

      // Add new requests to session
      sessionData.networkRequests = sessionData.networkRequests.concat(batchToFlush)

      // Update metadata
      sessionData.metadata = this.updateMetadata(sessionData.metadata, batchToFlush)

      // Prune old requests if needed (keep within limits)
      sessionData.networkRequests = this.pruneOldRequests(sessionData.networkRequests)

      // Store updated session
      await this.storageManager.storeSession(this.currentSessionId, sessionData)
    } catch (error) {
      logger.debug('Failed to flush network requests to storage:', error)
    }
  }

  /**
   * Create empty metadata structure
   */
  private createEmptyMetadata(): NetworkStorageMetadata {
    return {
      totalNetworkRequests: 0,
      oldestRequestTimestamp: Date.now(),
      newestRequestTimestamp: Date.now(),
      requestsByCategory: {},
      sizeBytesByCategory: {},
    }
  }

  /**
   * Update metadata with new batch of requests
   */
  private updateMetadata(
    metadata: NetworkStorageMetadata,
    requests: NetworkRequest[]
  ): NetworkStorageMetadata {
    const updated = { ...metadata }
    updated.totalNetworkRequests += requests.length

    requests.forEach((request) => {
      // Update timestamp range
      updated.oldestRequestTimestamp = Math.min(updated.oldestRequestTimestamp, request.timestamp)
      updated.newestRequestTimestamp = Math.max(updated.newestRequestTimestamp, request.timestamp)

      // Update category counts
      const category = request.category?.category || 'unknown'
      updated.requestsByCategory[category] = (updated.requestsByCategory[category] || 0) + 1

      // Update size by category
      const totalSize =
        request.size.requestBytes + request.size.responseBytes + request.size.headerBytes
      updated.sizeBytesByCategory[category] =
        (updated.sizeBytesByCategory[category] || 0) + totalSize
    })

    return updated
  }

  /**
   * Prune old requests to stay within storage limits
   */
  private pruneOldRequests(requests: NetworkRequest[]): NetworkRequest[] {
    // Sort by timestamp (newest first)
    const sorted = requests.sort((a, b) => b.timestamp - a.timestamp)

    // Keep last 5000 requests or requests from last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const maxRequests = 5000

    return sorted.filter((request, index) => {
      return index < maxRequests && request.timestamp > sevenDaysAgo
    })
  }

  /**
   * Get all network requests for current session
   */
  async getCurrentSessionRequests(): Promise<NetworkRequest[]> {
    try {
      // Combine in-memory requests with stored requests
      const sessionData = await this.storageManager.getSession(this.currentSessionId)
      const storedRequests = sessionData?.networkRequests || []

      return [...storedRequests, ...this.networkRequests].sort((a, b) => a.timestamp - b.timestamp)
    } catch (error) {
      logger.debug('Failed to get current session requests:', error)
      return this.networkRequests
    }
  }

  /**
   * Get network requests with filtering and pagination
   */
  async getNetworkRequests(
    options: {
      sessionId?: string
      startTime?: number
      endTime?: number
      category?: string
      method?: string
      limit?: number
      offset?: number
    } = {}
  ): Promise<NetworkRequest[]> {
    try {
      // const sessionId = options.sessionId || this.currentSessionId
      const allRequests = await this.getCurrentSessionRequests()

      // Apply filters
      const filtered = allRequests.filter((request) => {
        if (options.startTime && request.timestamp < options.startTime) return false
        if (options.endTime && request.timestamp > options.endTime) return false
        if (options.category && request.category?.category !== options.category) return false
        if (options.method && request.method !== options.method) return false
        return true
      })

      // Apply pagination
      const offset = options.offset || 0
      const limit = options.limit || filtered.length

      return filtered.slice(offset, offset + limit)
    } catch (error) {
      logger.debug('Failed to get filtered network requests:', error)
      return []
    }
  }

  /**
   * Get network requests by category
   */
  async getRequestsByCategory(category: string): Promise<NetworkRequest[]> {
    return this.getNetworkRequests({ category })
  }

  /**
   * Get slow network requests (above threshold)
   */
  async getSlowRequests(thresholdMs = 1000): Promise<NetworkRequest[]> {
    const allRequests = await this.getCurrentSessionRequests()
    return allRequests.filter((request) => request.timing.duration > thresholdMs)
  }

  /**
   * Get failed network requests
   */
  async getFailedRequests(): Promise<NetworkRequest[]> {
    const allRequests = await this.getCurrentSessionRequests()
    return allRequests.filter((request) => !request.status.success || request.error)
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    currentSessionRequests: number
    inMemoryRequests: number
    oldestRequestAge: number
    newestRequestAge: number
    totalSizeBytes: number
    requestsByCategory: Record<string, number>
  }> {
    try {
      const sessionData = await this.storageManager.getSession(this.currentSessionId)
      const storedRequests = sessionData?.networkRequests || []
      const allRequests = [...storedRequests, ...this.networkRequests]

      const now = Date.now()
      const totalSize = allRequests.reduce(
        (sum, req) => sum + req.size.requestBytes + req.size.responseBytes + req.size.headerBytes,
        0
      )

      const requestsByCategory = allRequests.reduce(
        (counts, req) => {
          const category = req.category?.category || 'unknown'
          counts[category] = (counts[category] || 0) + 1
          return counts
        },
        {} as Record<string, number>
      )

      return {
        currentSessionRequests: allRequests.length,
        inMemoryRequests: this.networkRequests.length,
        oldestRequestAge:
          allRequests.length > 0 ? now - Math.min(...allRequests.map((r) => r.timestamp)) : 0,
        newestRequestAge:
          allRequests.length > 0 ? now - Math.max(...allRequests.map((r) => r.timestamp)) : 0,
        totalSizeBytes: totalSize,
        requestsByCategory,
      }
    } catch (error) {
      logger.debug('Failed to get storage stats:', error)
      return {
        currentSessionRequests: this.networkRequests.length,
        inMemoryRequests: this.networkRequests.length,
        oldestRequestAge: 0,
        newestRequestAge: 0,
        totalSizeBytes: 0,
        requestsByCategory: {},
      }
    }
  }

  /**
   * Force flush all in-memory requests to storage
   */
  async flush(): Promise<void> {
    while (this.networkRequests.length > 0) {
      await this.flushBatchToStorage()
    }
  }

  /**
   * Start new session (useful for testing or session boundaries)
   */
  async startNewSession(): Promise<string> {
    // Flush current session
    await this.flush()

    // Generate new session ID
    this.currentSessionId = this.generateSessionId()
    this.networkRequests = []

    return this.currentSessionId
  }

  /**
   * Clear all network data for current session
   */
  async clearCurrentSession(): Promise<void> {
    this.networkRequests = []
    // Note: We don't clear persistent storage here to prevent accidental data loss
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string {
    return this.currentSessionId
  }

  /**
   * Set session ID to synchronize with main session management
   */
  async setSessionId(sessionId: string): Promise<void> {
    if (this.currentSessionId === sessionId) {
      return // Already using the correct session ID
    }

    // Flush current session before switching
    await this.flush()

    // Switch to new session ID
    this.currentSessionId = sessionId
    this.networkRequests = []

    logger.debug(`🔄 NetworkStorage session ID updated to: ${sessionId}`)
  }
}
