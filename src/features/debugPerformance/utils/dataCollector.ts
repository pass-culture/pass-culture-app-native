import { NetworkRequest, RenderEvent, ListPerformance } from '../types'
import { logger } from '../utils/logger'
/**
 * Thread-safe data collection mechanisms with queue-based processing
 * Ensures operations don't block the main thread and handle concurrent access
 */

interface QueuedOperation<T = unknown> {
  id: string
  type: 'network' | 'render' | 'list' | 'session'
  data: T
  timestamp: number
  retryCount: number
}

interface ProcessingStats {
  processed: number
  failed: number
  queued: number
  lastProcessed: number
}

export class DataCollector {
  private static instance: DataCollector
  private operationQueue: QueuedOperation[] = []
  private processing = false
  private processingLock = false
  private batchSize = 10
  private maxQueueSize = 1000
  private maxRetries = 3
  private processingInterval: NodeJS.Timeout | null = null
  private stats: ProcessingStats = {
    processed: 0,
    failed: 0,
    queued: 0,
    lastProcessed: Date.now(),
  }

  private constructor() {
    this.startProcessing()
  }

  static getInstance(): DataCollector {
    if (!DataCollector.instance) {
      DataCollector.instance = new DataCollector()
    }
    return DataCollector.instance
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async withProcessingLock<T>(operation: () => Promise<T>): Promise<T> {
    // Wait for lock to be released with timeout
    const maxWaitTime = 5000 // 5 seconds
    const startTime = Date.now()

    while (this.processingLock) {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error('Processing lock timeout')
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    this.processingLock = true
    try {
      return await operation()
    } finally {
      this.processingLock = false
    }
  }

  private startProcessing(): void {
    // Process queue every 100ms
    this.processingInterval = setInterval(() => {
      this.processQueue().catch((error) => {
        logger.debug('Queue processing error:', error)
      })
    }, 100)
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.operationQueue.length === 0) {
      return
    }

    await this.withProcessingLock(async () => {
      this.processing = true

      try {
        // Process operations in batches to prevent blocking
        const batch = this.operationQueue.splice(0, this.batchSize)
        const results = await Promise.allSettled(
          batch.map((operation) => this.processOperation(operation))
        )

        // Handle failed operations
        results.forEach((result, index) => {
          const operation = batch[index]

          if (result.status === 'rejected' && operation) {
            operation.retryCount++

            if (operation.retryCount < this.maxRetries) {
              // Re-queue for retry
              this.operationQueue.unshift(operation)
              logger.debug(`Retrying operation ${operation.id}, attempt ${operation.retryCount}`)
            } else {
              // Max retries reached, log and discard
              logger.error(
                `Operation ${operation.id} failed after ${this.maxRetries} retries:`,
                result.reason
              )
              this.stats.failed++
            }
          } else {
            this.stats.processed++
          }
        })

        this.stats.lastProcessed = Date.now()
      } finally {
        this.processing = false
      }
    })
  }

  private async processOperation(operation: QueuedOperation): Promise<void> {
    try {
      // Simulate processing time based on operation type
      const processingTime =
        {
          network: 5,
          render: 2,
          list: 3,
          session: 10,
        }[operation.type] || 5

      // Non-blocking delay
      await new Promise((resolve) => setTimeout(resolve, processingTime))

      // Operation processed successfully
      // In real implementation, this would save to storage, send to analytics, etc.
    } catch (error) {
      logger.debug(`Failed to process operation ${operation.id}:`, error)
      throw error
    }
  }

  // Public API for collecting different types of data
  collectNetworkData(data: NetworkRequest): boolean {
    return this.queueOperation('network', data)
  }

  collectRenderData(data: RenderEvent): boolean {
    return this.queueOperation('render', data)
  }

  collectListData(data: ListPerformance): boolean {
    return this.queueOperation('list', data)
  }

  collectSessionData(data: unknown): boolean {
    return this.queueOperation('session', data)
  }

  private queueOperation<T>(type: QueuedOperation['type'], data: T): boolean {
    try {
      // Check queue size limit
      if (this.operationQueue.length >= this.maxQueueSize) {
        // Remove oldest operations to make room
        const removeCount = Math.floor(this.maxQueueSize * 0.1) // Remove 10%
        this.operationQueue.splice(0, removeCount)
        logger.debug(`Queue size limit reached. Removed ${removeCount} oldest operations.`)
      }

      const operation: QueuedOperation<T> = {
        id: this.generateId(),
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0,
      }

      this.operationQueue.push(operation)
      this.stats.queued = this.operationQueue.length

      return true
    } catch (error) {
      logger.error('Failed to queue operation:', error)
      return false
    }
  }

  // Queue management and monitoring
  getQueueStats(): ProcessingStats & { queueSize: number } {
    return {
      ...this.stats,
      queueSize: this.operationQueue.length,
    }
  }

  clearQueue(): void {
    this.operationQueue = []
    this.stats.queued = 0
  }

  pauseProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
  }

  resumeProcessing(): void {
    if (!this.processingInterval) {
      this.startProcessing()
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    this.pauseProcessing()

    // Wait for current processing to complete
    while (this.processing || this.processingLock) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Process remaining queue items
    while (this.operationQueue.length > 0) {
      await this.processQueue()
    }
  }

  // Memory management
  getMemoryUsage(): { queueMemoryMB: number; statsMemoryMB: number } {
    const queueSize = new Blob([JSON.stringify(this.operationQueue)]).size
    const statsSize = new Blob([JSON.stringify(this.stats)]).size

    return {
      queueMemoryMB: Math.round((queueSize / (1024 * 1024)) * 100) / 100,
      statsMemoryMB: Math.round((statsSize / (1024 * 1024)) * 100) / 100,
    }
  }
}
