/**
 * Core session data models for performance debugging
 */

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web'
  osVersion: string
  appVersion: string
  deviceModel?: string
  screenResolution: {
    width: number
    height: number
  }
  memoryInfo?: {
    totalMemoryMB: number
    availableMemoryMB: number
  }
}

export interface PerformanceSession {
  sessionId: string
  startTime: number
  endTime?: number
  deviceInfo: DeviceInfo
  metrics: {
    networkRequests: NetworkRequest[]
    renderEvents: RenderEvent[]
    listPerformance: ListPerformance[]
  }
  totalMemoryUsageMB: number
  status: 'active' | 'completed' | 'expired'
}

export interface NetworkRequest {
  url: string
  requestId: string
  sessionId: string
  timestamp: number
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'
  sanitizedUrl: string // URLs with tokens/secrets removed
  timing: {
    startTime: number
    duration: number
    dnsLookup?: number
    connecting?: number
    waiting?: number
  }
  status: {
    code: number
    text: string
    success: boolean
  }
  size: {
    requestBytes: number
    responseBytes: number
    headerBytes: number
  }
  cacheHit: boolean
  category?: {
    category: 'api' | 'asset' | 'third-party' | 'analytics' | 'cdn'
    type: 'image' | 'document' | 'data' | 'font' | 'script' | 'stylesheet' | 'other'
    size: 'small' | 'medium' | 'large'
    priority: 'low' | 'medium' | 'high' | 'critical'
  }
  error?: {
    message: string
    type: string
  }
}

export interface RenderEvent {
  eventId: string
  sessionId: string
  componentName: string
  renderCount: number
  timestamp: number
  phase: 'mount' | 'update' | 'unmount'
  actualDuration: number // Time spent rendering
  baseDuration: number // Time without memoization
  triggerReason?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
  childrenCount: number
  memoryUsage?: number
}

export interface ListPerformance {
  listId: string
  sessionId: string
  timestamp: number
  listType: 'FlashList' | 'FlatList' | 'VirtualizedList'
  componentInfo: {
    listId: string // Unique identifier for this list instance
    componentName?: string // React component name (if available)
    screenName?: string // Screen/page name where this list is located
    listDescription?: string // Optional description (e.g., "offers", "categories", "search results")
    parentComponent?: string // Parent component name
    listPosition?: 'primary' | 'secondary' | 'nested' // Position hierarchy on screen
  }
  metrics: {
    blankAreaTime: number // Time showing blank areas during scroll
    drawTime: number // Time to draw visible items
    scrollFPS: number // Frames per second during scroll
    itemCount: number
    visibleItemCount: number
    averageItemHeight: number
  }
  scrollMetrics: {
    scrollTop: number
    scrollDirection: 'up' | 'down' | 'idle'
    velocity: number
  }
  memoryUsage: {
    listMemoryMB: number
    itemCacheSize: number
  }
  performance: {
    isScrolling: boolean
    hasBlanks: boolean
    droppedFrames: number
  }
}
