/**
 * Network request categorization utilities
 */

export type RequestCategory = 'api' | 'asset' | 'third-party' | 'analytics' | 'cdn'
export type RequestType = 'image' | 'document' | 'data' | 'font' | 'script' | 'stylesheet' | 'other'

export interface CategoryInfo {
  category: RequestCategory
  type: RequestType
  size: 'small' | 'medium' | 'large'
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export class RequestCategorizer {
  private static passCultureApiPatterns = [
    /passculture\.app/i,
    /passculture-api/i,
    /pass-culture/i,
    /api\.passculture/i,
  ]

  private static analyticsPatterns = [
    /google-analytics/i,
    /googletagmanager/i,
    /facebook\.com/i,
    /analytics/i,
    /tracking/i,
    /mixpanel/i,
    /amplitude/i,
    /segment/i,
  ]

  private static cdnPatterns = [
    /cloudflare/i,
    /amazonaws/i,
    /cloudfront/i,
    /cdn\./i,
    /assets\./i,
    /static\./i,
  ]

  private static imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.ico',
    '.bmp',
  ]
  private static documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
  private static fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot']
  private static scriptExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs']
  private static stylesheetExtensions = ['.css', '.scss', '.sass', '.less']

  /**
   * Categorize a network request based on URL and metadata
   */
  static categorizeRequest(
    url: string,
    method: string,
    responseBytes: number,
    headers?: Record<string, string>
  ): CategoryInfo {
    const category = this.determineCategory(url)
    const type = this.determineType(url, headers)
    const size = this.determineSize(responseBytes)
    const priority = this.determinePriority(category, type, method)

    return { category, type, size, priority }
  }

  /**
   * Determine request category (API, asset, third-party, etc.)
   */
  private static determineCategory(url: string): RequestCategory {
    const lowerUrl = url.toLowerCase()

    // Check for PassCulture API
    if (this.passCultureApiPatterns.some((pattern) => pattern.test(url))) {
      return 'api'
    }

    // Check for analytics
    if (this.analyticsPatterns.some((pattern) => pattern.test(url))) {
      return 'analytics'
    }

    // Check for CDN
    if (this.cdnPatterns.some((pattern) => pattern.test(url))) {
      return 'cdn'
    }

    // Check if it's a local/same-origin request
    try {
      const urlObj = new URL(url)
      const currentHost = typeof window === 'undefined' ? '' : window.location.host

      if (
        urlObj.host === currentHost ||
        urlObj.host.includes('localhost') ||
        urlObj.host.includes('127.0.0.1')
      ) {
        // Local API if it has /api/ path
        if (lowerUrl.includes('/api/') || lowerUrl.includes('/graphql')) {
          return 'api'
        }
        // Local asset
        return 'asset'
      }
    } catch {
      // Invalid URL, assume third-party
    }

    // Default to third-party
    return 'third-party'
  }

  /**
   * Determine request type based on URL and headers
   */
  private static determineType(url: string, headers?: Record<string, string>): RequestType {
    const lowerUrl = url.toLowerCase()

    // Check Content-Type header first
    if (headers) {
      const contentType = headers['content-type']?.toLowerCase()
      if (contentType) {
        if (contentType.includes('image/')) return 'image'
        if (contentType.includes('font/') || contentType.includes('application/font')) return 'font'
        if (contentType.includes('text/css')) return 'stylesheet'
        if (contentType.includes('javascript') || contentType.includes('text/javascript'))
          return 'script'
        if (contentType.includes('application/pdf')) return 'document'
        if (contentType.includes('application/json') || contentType.includes('application/xml'))
          return 'data'
      }
    }

    // Check file extension
    const extension = this.getFileExtension(url)
    if (this.imageExtensions.includes(extension)) return 'image'
    if (this.documentExtensions.includes(extension)) return 'document'
    if (this.fontExtensions.includes(extension)) return 'font'
    if (this.scriptExtensions.includes(extension)) return 'script'
    if (this.stylesheetExtensions.includes(extension)) return 'stylesheet'

    // Check URL patterns
    if (lowerUrl.includes('/api/') || lowerUrl.includes('/graphql') || lowerUrl.includes('.json')) {
      return 'data'
    }

    return 'other'
  }

  /**
   * Determine size category based on response bytes
   */
  private static determineSize(responseBytes: number): 'small' | 'medium' | 'large' {
    if (responseBytes < 10 * 1024) return 'small' // < 10KB
    if (responseBytes < 100 * 1024) return 'medium' // < 100KB
    return 'large' // >= 100KB
  }

  /**
   * Determine priority based on category, type, and method
   */
  private static determinePriority(
    category: RequestCategory,
    type: RequestType,
    method: string
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical: API calls that modify data
    if (category === 'api' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
      return 'critical'
    }

    // High: API GET requests and essential assets
    if (category === 'api' && method.toUpperCase() === 'GET') {
      return 'high'
    }

    // High: Scripts and stylesheets (blocking resources)
    if (type === 'script' || type === 'stylesheet') {
      return 'high'
    }

    // Medium: Images and fonts
    if (type === 'image' || type === 'font') {
      return 'medium'
    }

    // Medium: CDN assets
    if (category === 'cdn') {
      return 'medium'
    }

    // Low: Analytics and third-party
    if (category === 'analytics' || category === 'third-party') {
      return 'low'
    }

    return 'medium'
  }

  /**
   * Extract file extension from URL
   */
  private static getFileExtension(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const lastDotIndex = pathname.lastIndexOf('.')

      if (lastDotIndex === -1) return ''

      const extension = pathname.substring(lastDotIndex).toLowerCase()
      // Remove query parameters from extension
      return extension.split('?')[0] || ''
    } catch {
      return ''
    }
  }

  /**
   * Get human-readable category description
   */
  static getCategoryDescription(category: RequestCategory): string {
    switch (category) {
      case 'api':
        return 'API Request'
      case 'asset':
        return 'Static Asset'
      case 'third-party':
        return 'Third-party Service'
      case 'analytics':
        return 'Analytics/Tracking'
      case 'cdn':
        return 'CDN Resource'
      default:
        return 'Unknown'
    }
  }

  /**
   * Get human-readable type description
   */
  static getTypeDescription(type: RequestType): string {
    switch (type) {
      case 'image':
        return 'Image'
      case 'document':
        return 'Document'
      case 'data':
        return 'Data/JSON'
      case 'font':
        return 'Font'
      case 'script':
        return 'JavaScript'
      case 'stylesheet':
        return 'CSS'
      case 'other':
        return 'Other'
      default:
        return 'Unknown'
    }
  }

  /**
   * Check if a request should be monitored closely
   */
  static shouldMonitorClosely(categoryInfo: CategoryInfo): boolean {
    // Monitor API calls and high-priority requests closely
    return (
      categoryInfo.category === 'api' ||
      categoryInfo.priority === 'critical' ||
      categoryInfo.priority === 'high'
    )
  }

  /**
   * Get suggested timeout for request category
   */
  static getSuggestedTimeout(categoryInfo: CategoryInfo): number {
    switch (categoryInfo.category) {
      case 'api':
        return categoryInfo.priority === 'critical' ? 30000 : 15000
      case 'asset':
      case 'cdn':
        return categoryInfo.size === 'large' ? 60000 : 30000
      case 'analytics':
      case 'third-party':
        return 10000
      default:
        return 15000
    }
  }
}
