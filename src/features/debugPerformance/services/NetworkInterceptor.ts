/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NetworkRequest } from '../types'
import { logger } from '../utils/logger'
import { now } from '../utils/performanceTiming'
import { RequestCategorizer } from '../utils/requestCategorization'

interface InterceptionHandlers {
  onRequest?: (request: Partial<NetworkRequest>) => void
  onResponse?: (request: NetworkRequest) => void
  onError?: (request: NetworkRequest) => void
}

interface RequestTracking {
  [key: string]: {
    requestId: string
    sessionId: string
    method: string
    sanitizedUrl: string
    startTime: number
    requestBytes: number
  }
}

export class NetworkInterceptor {
  private static instance: NetworkInterceptor
  private isActive = false
  private handlers: InterceptionHandlers = {}
  private requestTracking: RequestTracking = {}
  private originalFetch: typeof fetch
  private originalXHROpen: typeof XMLHttpRequest.prototype.open
  private originalXHRSend: typeof XMLHttpRequest.prototype.send
  private requestIdCounter = 0

  private constructor() {
    // Safe initialization for cross-platform compatibility
    try {
      // For React Native, fetch might be on global, for web it might be on window
      this.originalFetch =
        (global as any).fetch || (typeof window === 'undefined' ? null : window.fetch) || fetch
    } catch (error) {
      logger.debug('Could not access original fetch during initialization:', error)
      this.originalFetch = null as any
    }

    try {
      if (typeof XMLHttpRequest === 'undefined') {
        // React Native might not have XMLHttpRequest
        logger.debug('XMLHttpRequest not available during initialization')
        this.originalXHROpen = null as any
        this.originalXHRSend = null as any
      } else {
        this.originalXHROpen = XMLHttpRequest.prototype.open
        this.originalXHRSend = XMLHttpRequest.prototype.send
      }
    } catch (error) {
      logger.debug('Could not access XMLHttpRequest during initialization:', error)
      this.originalXHROpen = null as any
      this.originalXHRSend = null as any
    }
  }

  static getInstance(): NetworkInterceptor {
    if (!NetworkInterceptor.instance) {
      NetworkInterceptor.instance = new NetworkInterceptor()
    }
    return NetworkInterceptor.instance
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestIdCounter}`
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url)

      // Remove sensitive query parameters
      const sensitiveParams = ['token', 'key', 'secret', 'password', 'auth', 'api_key', 'apikey']
      sensitiveParams.forEach((param) => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '[REDACTED]')
        }
      })

      // Remove sensitive path segments
      const pathSegments = urlObj.pathname.split('/')
      const sensitiveSegments = ['token', 'key', 'secret', 'auth']
      const sanitizedPath = pathSegments
        .map((segment) => {
          if (sensitiveSegments.some((sensitive) => segment.toLowerCase().includes(sensitive))) {
            return '[REDACTED]'
          }
          // Replace UUIDs and long IDs
          if (
            /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(segment) ||
            /^[a-f\d]{20,}$/i.test(segment)
          ) {
            return '[ID]'
          }
          return segment
        })
        .join('/')

      return urlObj.protocol + '//' + urlObj.host + sanitizedPath + urlObj.search
    } catch {
      return url.replace(
        /([?&])(token|key|secret|password|auth|api_key|apikey)=[^&]*/gi,
        '$1$2=[REDACTED]'
      )
    }
  }

  /**
   * Safely get response header without throwing security errors
   */
  private safeGetResponseHeader(xhr: XMLHttpRequest, headerName: string): string | null {
    try {
      return xhr.getResponseHeader(headerName)
    } catch (error) {
      // Silently ignore unsafe header access errors
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.debug(`Cannot access header "${headerName}": ${error}`)
      return null
    }
  }

  /**
   * Detect cache hit from safe headers
   */
  private detectCacheHit(xhr: XMLHttpRequest): boolean {
    try {
      // Try safe cache detection methods
      const cacheControl = this.safeGetResponseHeader(xhr, 'cache-control')
      const etag = this.safeGetResponseHeader(xhr, 'etag')
      const lastModified = this.safeGetResponseHeader(xhr, 'last-modified')

      // Try unsafe headers with error handling
      const xCache = this.safeGetResponseHeader(xhr, 'x-cache')
      const cfCacheStatus = this.safeGetResponseHeader(xhr, 'cf-cache-status')

      // Check various cache indicators
      if (xCache?.includes('HIT') || cfCacheStatus?.includes('HIT')) {
        return true
      }

      // Secondary cache indicators
      if (cacheControl?.includes('max-age') && etag && lastModified) {
        return true // Likely cached
      }

      return false
    } catch (error) {
      logger.debug('Cache detection failed:', error)
      return false
    }
  }

  /**
   * Detect cache hit from fetch response headers safely
   */
  private detectCacheHitFromFetch(headers: Headers): boolean {
    try {
      // Try cache headers with error handling
      let xCache: string | null = null
      let cfCacheStatus: string | null = null

      try {
        xCache = headers.get('x-cache')
      } catch (error) {
        logger.debug('Cannot access x-cache header:', error)
      }

      try {
        cfCacheStatus = headers.get('cf-cache-status')
      } catch (error) {
        logger.debug('Cannot access cf-cache-status header:', error)
      }

      if (xCache?.includes('HIT') || cfCacheStatus?.includes('HIT')) {
        return true
      }

      // Secondary cache indicators from safe headers
      const cacheControl = headers.get('cache-control')
      const etag = headers.get('etag')
      const lastModified = headers.get('last-modified')

      if (cacheControl?.includes('max-age') && etag && lastModified) {
        return true // Likely cached
      }

      return false
    } catch (error) {
      logger.debug('Fetch cache detection failed:', error)
      return false
    }
  }

  private calculateRequestSize(body: any, headers: any): number {
    let size = 0

    if (body) {
      if (typeof body === 'string') {
        size += new TextEncoder().encode(body).length
      } else if (typeof FormData !== 'undefined' && body instanceof FormData) {
        // Estimate FormData size
        size += 1024 // Rough estimate
      } else if (body instanceof ArrayBuffer) {
        size += body.byteLength
      } else if (typeof Blob !== 'undefined' && body instanceof Blob) {
        size += body.size
      } else {
        size += new TextEncoder().encode(JSON.stringify(body)).length
      }
    }

    if (headers) {
      size += new TextEncoder().encode(JSON.stringify(headers)).length
    }

    return size
  }

  private setupFetchInterception(): boolean {
    try {
      logger.debug('Setting up fetch interception...')

      // Cross-platform fetch detection
      const fetchReference =
        (global as any).fetch ||
        (typeof window === 'undefined' ? null : window.fetch) ||
        (typeof fetch === 'undefined' ? null : fetch)

      if (!fetchReference || !this.originalFetch) {
        logger.debug('Fetch API is not available, skipping fetch interception')
        return false
      }

      logger.debug('Fetch API available, setting up interception')
      logger.debug('Original fetch type:', typeof this.originalFetch)

      // Set up intercepted fetch - use appropriate global object
      const globalObj = (global as any).fetch
        ? global
        : typeof window === 'undefined'
          ? global
          : window
      globalObj.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        if (!this.isActive) {
          return this.originalFetch.call(globalObj, input as RequestInfo, init)
        }

        const requestId = this.generateRequestId()
        const sessionId = 'current' // Will be provided by context
        const startTime = now()
        const method = (init?.method || 'GET').toUpperCase()
        const url = typeof input === 'string' ? input : input.toString()
        const sanitizedUrl = this.sanitizeUrl(url)

        const requestBytes = this.calculateRequestSize(init?.body, init?.headers)

        // Store request tracking info
        this.requestTracking[requestId] = {
          requestId,
          sessionId,
          method,
          sanitizedUrl,
          startTime,
          requestBytes,
        }

        // Notify handlers of request start
        this.handlers.onRequest?.({
          requestId,
          sessionId,
          method: method as any,
          sanitizedUrl,
          timestamp: Date.now(),
        })

        try {
          const response = await this.originalFetch.call(globalObj, input as RequestInfo, init)
          const endTime = now()
          const duration = endTime - startTime

          // Get response size from headers
          let responseBytes = parseInt(response.headers.get('content-length') || '0', 10)

          // Si content-length n'est pas disponible, estimer
          if (!responseBytes) {
            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('json')) {
              responseBytes = 2048 // Estimation pour JSON
            } else if (contentType.includes('image')) {
              responseBytes = 10240 // Estimation pour images
            } else {
              responseBytes = 1024 // Estimation générale
            }
          }

          const headerBytes = Array.from(response.headers.entries()).reduce(
            (acc, [key, value]) => acc + key.length + value.length,
            0
          )

          // Categorize the request
          const responseHeaders: Record<string, string> = {}
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value
          })

          const categoryInfo = RequestCategorizer.categorizeRequest(
            sanitizedUrl,
            method,
            responseBytes,
            responseHeaders
          )

          // Create network request record
          const networkRequest: NetworkRequest = {
            url: sanitizedUrl,
            requestId,
            sessionId,
            timestamp: Date.now(),
            method: method as any,
            sanitizedUrl,
            timing: {
              startTime,
              duration,
            },
            status: {
              code: response.status,
              text: response.statusText,
              success: response.ok,
            },
            size: {
              requestBytes,
              responseBytes,
              headerBytes,
            },
            cacheHit: this.detectCacheHitFromFetch(response.headers),
            category: categoryInfo,
          }

          // Cleanup tracking
          delete this.requestTracking[requestId]

          // Console log for debugging
          logger.verbose(`[NetworkInterceptor] 📡 ${method} ${sanitizedUrl}`, {
            status: response.status,
            duration: `${duration.toFixed(2)}ms`,
            category: categoryInfo.category,
            type: categoryInfo.type,
            priority: categoryInfo.priority,
            size:
              responseBytes < 1024 ? `${responseBytes}B` : `${Math.round(responseBytes / 1024)}KB`,
          })

          // Notify handlers
          this.handlers.onResponse?.(networkRequest)

          return response
        } catch (error) {
          const endTime = now()
          const duration = endTime - startTime

          // Categorize the request (error case)
          const categoryInfo = RequestCategorizer.categorizeRequest(sanitizedUrl, method, 0, {})

          const networkRequest: NetworkRequest = {
            url: sanitizedUrl,
            requestId,
            sessionId,
            timestamp: Date.now(),
            method: method as any,
            sanitizedUrl,
            timing: {
              startTime,
              duration,
            },
            status: {
              code: 0,
              text: 'Network Error',
              success: false,
            },
            size: {
              requestBytes,
              responseBytes: 0,
              headerBytes: 0,
            },
            cacheHit: false,
            category: categoryInfo,
            error: {
              message: error instanceof Error ? error.message : String(error),
              type: error instanceof Error ? error.name : 'UnknownError',
            },
          }

          // Cleanup tracking
          delete this.requestTracking[requestId]

          // Console log for debugging (error case)
          logger.verbose(`[NetworkInterceptor] ❌ ${method} ${sanitizedUrl}`, {
            error: error instanceof Error ? error.message : String(error),
            duration: `${duration.toFixed(2)}ms`,
            category: categoryInfo.category,
          })

          // Notify handlers
          this.handlers.onError?.(networkRequest)

          throw error
        }
      }

      logger.debug('Fetch interception setup completed')
      return true
    } catch (error) {
      logger.error('Failed to setup fetch interception:', error)
      return false
    }
  }

  private setupXHRInterception(): boolean {
    try {
      logger.debug('Setting up XHR interception...')

      // Check if XMLHttpRequest is available and we have original references
      if (typeof XMLHttpRequest === 'undefined' || !this.originalXHROpen || !this.originalXHRSend) {
        logger.debug(
          'XMLHttpRequest is not available or could not be saved, skipping XHR interception'
        )
        return false
      }

      logger.debug('XMLHttpRequest available, proceeding with interception')

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this

      XMLHttpRequest.prototype.open = function (
        method: string,
        url: string | URL,
        async?: boolean,
        user?: string | null,
        password?: string | null
      ) {
        if (!self.isActive) {
          return self.originalXHROpen.call(
            this,
            method,
            typeof url === 'string' ? url : url.toString(),
            async,
            user,
            password
          )
        }

        const requestId = self.generateRequestId()
        const sessionId = 'current'
        const sanitizedUrl = self.sanitizeUrl(typeof url === 'string' ? url : url.toString())

        // Store request info on XHR object
        ;(this as any)._debugPerformance = {
          requestId,
          sessionId,
          method: method.toUpperCase(),
          sanitizedUrl,
          startTime: 0,
          requestBytes: 0,
        }

        return self.originalXHROpen.call(
          this,
          method,
          typeof url === 'string' ? url : url.toString(),
          async,
          user,
          password
        )
      }

      XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
        if (!self.isActive || !(this as any)._debugPerformance) {
          return self.originalXHRSend.call(this, body)
        }

        const debugInfo = (this as any)._debugPerformance
        debugInfo.startTime = now()
        debugInfo.requestBytes = self.calculateRequestSize(body, null)

        // Store in tracking
        self.requestTracking[debugInfo.requestId] = debugInfo

        // Notify handlers of request start
        self.handlers.onRequest?.({
          requestId: debugInfo.requestId,
          sessionId: debugInfo.sessionId,
          method: debugInfo.method,
          sanitizedUrl: debugInfo.sanitizedUrl,
          timestamp: Date.now(),
        })

        // Setup response handlers
        const originalReadyStateChange = this.onreadystatechange

        this.onreadystatechange = function (ev: Event) {
          if (this.readyState === XMLHttpRequest.DONE) {
            const endTime = now()
            const duration = endTime - debugInfo.startTime

            let responseBytes = parseInt(this.getResponseHeader('content-length') || '0', 10)

            // Si content-length n'est pas disponible, estimer la taille
            if (!responseBytes && this.response) {
              if (typeof this.response === 'string') {
                responseBytes = new TextEncoder().encode(this.response).length
              } else if (this.response instanceof ArrayBuffer) {
                responseBytes = this.response.byteLength
              } else if (typeof Blob !== 'undefined' && this.response instanceof Blob) {
                responseBytes = this.response.size
              } else {
                // Estimation approximative pour autres types
                responseBytes = JSON.stringify(this.response).length
              }
            }

            // Extract response headers for categorization
            const responseHeaders: Record<string, string> = {}
            const headersStr = this.getAllResponseHeaders()
            if (headersStr) {
              headersStr.split('\r\n').forEach((line) => {
                const [key, value] = line.split(': ')
                if (key && value) {
                  responseHeaders[key.toLowerCase()] = value
                }
              })
            }

            // Categorize the request
            const categoryInfo = RequestCategorizer.categorizeRequest(
              debugInfo.sanitizedUrl,
              debugInfo.method,
              responseBytes,
              responseHeaders
            )

            const networkRequest: NetworkRequest = {
              url: debugInfo.sanitizedUrl,
              requestId: debugInfo.requestId,
              sessionId: debugInfo.sessionId,
              timestamp: Date.now(),
              method: debugInfo.method,
              sanitizedUrl: debugInfo.sanitizedUrl,
              timing: {
                startTime: debugInfo.startTime,
                duration,
              },
              status: {
                code: this.status,
                text: this.statusText,
                success: this.status >= 200 && this.status < 300,
              },
              size: {
                requestBytes: debugInfo.requestBytes,
                responseBytes,
                headerBytes: this.getAllResponseHeaders()?.length || 0,
              },
              cacheHit: self.detectCacheHit(this),
              category: categoryInfo,
            }

            if (this.status === 0 || this.status >= 400) {
              networkRequest.error = {
                message: this.statusText || 'Request failed',
                type: 'HTTPError',
              }

              // Console log for debugging (XHR error)
              logger.verbose(
                `[NetworkInterceptor] ❌ ${debugInfo.method} ${debugInfo.sanitizedUrl}`,
                {
                  status: this.status,
                  error: this.statusText || 'Request failed',
                  duration: `${duration.toFixed(2)}ms`,
                  category: categoryInfo.category,
                }
              )

              self.handlers.onError?.(networkRequest)
            } else {
              // Console log for debugging (XHR success)
              logger.verbose(
                `[NetworkInterceptor] 📡 ${debugInfo.method} ${debugInfo.sanitizedUrl}`,
                {
                  status: this.status,
                  duration: `${duration.toFixed(2)}ms`,
                  category: categoryInfo.category,
                  type: categoryInfo.type,
                  size:
                    responseBytes < 1024
                      ? `${responseBytes}B`
                      : `${Math.round(responseBytes / 1024)}KB`,
                }
              )

              self.handlers.onResponse?.(networkRequest)
            }

            // Cleanup
            delete self.requestTracking[debugInfo.requestId]
          }

          if (originalReadyStateChange) {
            originalReadyStateChange.call(this, ev)
          }
        }

        return self.originalXHRSend.call(this, body)
      }

      logger.debug('XHR interception setup completed')
      return true
    } catch (error) {
      logger.error('Failed to setup XHR interception:', error)
      return false
    }
  }

  start(handlers: InterceptionHandlers = {}): boolean {
    if (this.isActive) {
      logger.info('[NetworkInterceptor] Already active, returning true')
      return true
    }

    try {
      logger.info('[NetworkInterceptor] 🚀 Starting network interception...')

      // Enhanced platform detection
      const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
      const isWeb = typeof window !== 'undefined'

      logger.info(`Environment: ${isReactNative ? 'React Native' : isWeb ? 'Web' : 'Unknown'}`)

      this.handlers = handlers

      logger.debug('Setting up fetch interception...')
      const fetchSuccess = this.setupFetchInterception()
      logger.info(`Fetch interception: ${fetchSuccess ? '✅ SUCCESS' : '❌ FAILED'}`)

      logger.debug('Setting up XHR interception...')
      const xhrSuccess = this.setupXHRInterception()
      logger.info(`XHR interception: ${xhrSuccess ? '✅ SUCCESS' : '❌ FAILED'}`)

      // At least one method must succeed
      const overallSuccess = fetchSuccess || xhrSuccess

      if (overallSuccess) {
        this.isActive = true
        logger.info('[NetworkInterceptor] ✅ Network interception started successfully')
        return true
      } else {
        logger.error('[NetworkInterceptor] ❌ Failed to start any network interception method')
        this.isActive = false
        return false
      }
    } catch (error) {
      logger.error('❌ Failed to start network interception:', error)
      this.isActive = false
      return false
    }
  }

  stop(): void {
    if (!this.isActive) {
      return
    }

    try {
      // Restore original implementations safely
      if (this.originalFetch) {
        const globalObj = (global as any).fetch
          ? global
          : typeof window === 'undefined'
            ? global
            : window
        globalObj.fetch = this.originalFetch
      }

      if (this.originalXHROpen && typeof XMLHttpRequest !== 'undefined') {
        XMLHttpRequest.prototype.open = this.originalXHROpen
      }

      if (this.originalXHRSend && typeof XMLHttpRequest !== 'undefined') {
        XMLHttpRequest.prototype.send = this.originalXHRSend
      }

      // Clear handlers and tracking
      this.handlers = {}
      this.requestTracking = {}
      this.isActive = false

      logger.info('[NetworkInterceptor] ⏹️ Network interception stopped')
    } catch (error) {
      logger.error('Failed to stop network interception:', error)
    }
  }

  isInterceptionActive(): boolean {
    return this.isActive
  }

  getActiveRequestsCount(): number {
    return Object.keys(this.requestTracking).length
  }
}
