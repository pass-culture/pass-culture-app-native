import { logger } from './logger'

export interface SanitizationConfig {
  removeAuthTokens: boolean
  sanitizePersonalData: boolean
  redactSensitiveParams: boolean
  preserveStructure: boolean
  customRules: SanitizationRule[]
}

export interface SanitizationRule {
  field: string
  pattern?: RegExp
  replacement: string
  applyToKeys?: boolean
  applyToValues?: boolean
}

class DataSanitizer {
  private static instance: DataSanitizer
  private config: SanitizationConfig

  private readonly SENSITIVE_URL_PARAMS = [
    'token',
    'access_token',
    'refresh_token',
    'api_key',
    'apikey',
    'password',
    'pwd',
    'pass',
    'secret',
    'key',
    'email',
    'mail',
    'phone',
    'tel',
    'mobile',
    'ssn',
    'social_security',
    'credit_card',
    'cc',
    'cvv',
    'authorization',
    'auth',
    'bearer',
  ]

  private readonly SENSITIVE_HEADERS = [
    'authorization',
    'x-auth-token',
    'x-api-key',
    'cookie',
    'set-cookie',
    'x-access-token',
    'x-refresh-token',
    'bearer',
    'x-csrf-token',
  ]

  private readonly SENSITIVE_JSON_FIELDS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'apiKey',
    'email',
    'phoneNumber',
    'creditCard',
    'ssn',
    'socialSecurity',
    'secret',
    'key',
    'auth',
    'authorization',
  ]

  private readonly SAFE_SYSTEM_FIELDS = [
    'sessionId',
    'listId',
    'requestId',
    'componentName',
    'listType',
    'timestamp',
    'startTime',
    'endTime',
    'duration',
    'platform',
    'os',
    'model',
    'brand',
    'deviceType',
    'appVersion',
    'buildNumber',
  ]

  private readonly EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  private readonly PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g
  private readonly TOKEN_REGEX = /[A-Za-z0-9+/]{20,}={0,2}/g
  private readonly UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

  private constructor() {
    this.config = {
      removeAuthTokens: true,
      sanitizePersonalData: true,
      redactSensitiveParams: true,
      preserveStructure: true,
      customRules: [],
    }
  }

  static getInstance(): DataSanitizer {
    if (!DataSanitizer.instance) {
      DataSanitizer.instance = new DataSanitizer()
    }
    return DataSanitizer.instance
  }

  setConfig(config: Partial<SanitizationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  createPerformanceExportConfig(): SanitizationConfig {
    return {
      removeAuthTokens: true,
      sanitizePersonalData: false, // Less aggressive for performance data
      redactSensitiveParams: true,
      preserveStructure: true,
      customRules: [
        // Only redact actual sensitive tokens, not system IDs
        { field: 'bearer', pattern: /bearer\s+[a-zA-Z0-9]/i, replacement: '[BEARER_TOKEN]' },
        { field: 'cookie', pattern: /session[_=][a-zA-Z0-9]+/i, replacement: '[SESSION_COOKIE]' },
      ],
    }
  }

  sanitizeExportData(exportData: unknown): unknown {
    try {
      logger.debug('🧹 Starting data sanitization')

      const sanitizedData = this.deepSanitize(exportData)

      logger.debug('✅ Data sanitization completed')
      return sanitizedData
    } catch (error) {
      logger.error('❌ Sanitization failed:', error)
      return this.createSafetyFallback(exportData)
    }
  }

  sanitizeNetworkRequest(request: {
    url: string
    headers: Record<string, string>
    body: unknown
    response: {
      headers: Record<string, string>
      body: unknown
      data: unknown
    }
  }): unknown {
    if (!request) return request

    return {
      ...request,
      url: this.sanitizeUrl(request.url),
      headers: this.sanitizeHeaders(request.headers),
      body: this.sanitizeRequestBody(request.body),
      response: this.sanitizeResponse(request.response),
    }
  }

  private deepSanitize(obj: unknown, depth = 0): unknown {
    // Prevent infinite recursion
    if (depth > 10) {
      return '[DEPTH_LIMIT_EXCEEDED]'
    }

    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj)
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item, depth + 1))
    }

    if (typeof obj === 'object') {
      const sanitizedObj: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.shouldSanitizeKey(key) ? '[REDACTED]' : key
        const sanitizedValue = this.shouldSanitizeField(key)
          ? '[REDACTED]'
          : this.deepSanitize(value, depth + 1)

        sanitizedObj[sanitizedKey] = sanitizedValue
      }

      return sanitizedObj
    }

    return obj
  }

  private sanitizeString(str: string): string {
    if (!this.config.sanitizePersonalData) {
      return str
    }

    let sanitized = str

    // Replace emails
    sanitized = sanitized.replace(this.EMAIL_REGEX, '[EMAIL_REDACTED]')

    // Replace phone numbers
    sanitized = sanitized.replace(this.PHONE_REGEX, '[PHONE_REDACTED]')

    // Replace potential tokens (long base64-like strings)
    if (this.config.removeAuthTokens) {
      sanitized = sanitized.replace(this.TOKEN_REGEX, '[TOKEN_REDACTED]')
    }

    // Replace UUIDs (often used as session IDs)
    sanitized = sanitized.replace(this.UUID_REGEX, '[UUID_REDACTED]')

    // Apply custom rules
    for (const rule of this.config.customRules) {
      if (rule.pattern && rule.applyToValues !== false) {
        sanitized = sanitized.replace(rule.pattern, rule.replacement)
      }
    }

    return sanitized
  }

  private sanitizeUrl(url: string): string {
    if (!url) return url

    try {
      const urlObj = new URL(url)

      // Sanitize query parameters
      if (this.config.redactSensitiveParams) {
        for (const param of this.SENSITIVE_URL_PARAMS) {
          if (urlObj.searchParams.has(param)) {
            urlObj.searchParams.set(param, '[REDACTED]')
          }
        }
      }

      return urlObj.toString()
    } catch {
      // Invalid URL, sanitize as string
      return this.sanitizeString(url)
    }
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    if (!headers || !this.config.removeAuthTokens) return headers

    const sanitizedHeaders: Record<string, string> = {}

    for (const [key, value] of Object.entries(headers || {})) {
      const lowerKey = key.toLowerCase()

      if (this.SENSITIVE_HEADERS.includes(lowerKey)) {
        sanitizedHeaders[key] = '[REDACTED]'
      } else {
        sanitizedHeaders[key] = this.sanitizeString(String(value))
      }
    }

    return sanitizedHeaders
  }

  private sanitizeRequestBody(body: unknown): unknown {
    if (!body) return body

    if (typeof body === 'string') {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(body)
        return JSON.stringify(this.deepSanitize(parsed))
      } catch {
        // Not JSON, sanitize as string
        return this.sanitizeString(body)
      }
    }

    return this.deepSanitize(body)
  }

  private sanitizeResponse(response: {
    headers: Record<string, string>
    body: unknown
    data: unknown
  }): unknown {
    if (!response) return response

    return {
      ...response,
      headers: this.sanitizeHeaders(response.headers),
      body: this.sanitizeRequestBody(response.body),
      data: response.data ? this.deepSanitize(response.data) : response.data,
    }
  }

  private shouldSanitizeKey(key: string): boolean {
    if (!this.config.preserveStructure) return false

    const lowerKey = key.toLowerCase()
    return this.SENSITIVE_JSON_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()))
  }

  private shouldSanitizeField(key: string): boolean {
    const lowerKey = key.toLowerCase()

    // Don't sanitize safe system fields
    if (this.SAFE_SYSTEM_FIELDS.some((field) => lowerKey === field.toLowerCase())) {
      return false
    }

    // Check against sensitive field names
    if (
      this.SENSITIVE_JSON_FIELDS.some(
        (field) => lowerKey === field.toLowerCase() || lowerKey.includes(field.toLowerCase())
      )
    ) {
      return true
    }

    // Apply custom rules for keys
    for (const rule of this.config.customRules) {
      if (rule.applyToKeys && rule.pattern && rule.pattern.test(key)) {
        return true
      }
    }

    return false
  }

  private createSafetyFallback(originalData: unknown): unknown {
    // In case of sanitization failure, return a minimal safe structure
    return {
      sanitization: {
        status: 'failed',
        error: 'Sanitization process failed, data removed for safety',
        timestamp: new Date().toISOString(),
      },
      originalDataType: typeof originalData,
      originalDataKeys:
        typeof originalData === 'object' && originalData !== null
          ? Object.keys(originalData).length
          : 0,
    }
  }

  // Utility method to validate sanitization effectiveness
  validateSanitization(data: unknown): { isClean: boolean; issues: string[] } {
    const issues: string[] = []
    const dataStr = JSON.stringify(data)

    // Check for potential leaks
    if (this.EMAIL_REGEX.test(dataStr)) {
      issues.push('Potential email addresses found')
    }

    if (this.PHONE_REGEX.test(dataStr)) {
      issues.push('Potential phone numbers found')
    }

    if (/bearer\s+[a-zA-Z0-9]/i.test(dataStr)) {
      issues.push('Potential bearer tokens found')
    }

    if (/password['":\s]*[^'"[\],}]+/i.test(dataStr)) {
      issues.push('Potential password fields found')
    }

    return {
      isClean: issues.length === 0,
      issues,
    }
  }
}

// Export singleton instance and types
export const dataSanitizer = DataSanitizer.getInstance()
export { DataSanitizer }
