/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-restricted-properties */
import { Platform, Dimensions } from 'react-native'

export interface DeviceInfo {
  // Platform info
  platform: 'ios' | 'android' | 'web'
  os: string
  osVersion: string

  // Device specs
  model: string
  brand: string
  deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown'

  // Screen info
  screenWidth: number
  screenHeight: number
  pixelRatio: number

  // App info
  appVersion: string
  buildNumber: string
  bundleId: string

  // Runtime info
  timezone: string
  locale: string
  userAgent?: string

  // Session context
  sessionStartTime: number
  deviceMemory?: number
  hardwareConcurrency?: number
}

export interface SessionMetadata {
  sessionId: string
  startTime: number
  endTime?: number
  duration?: number
  timezone: string
  locale: string

  // Configuration active
  activeConfig: {
    enableNetworkMonitoring: boolean
    enableRenderTracking: boolean
    enableListPerformance: boolean
    verboseLogging: boolean
    debugMode: boolean
  }
}

class DeviceInfoCollector {
  private static instance: DeviceInfoCollector
  private cachedDeviceInfo: DeviceInfo | null = null

  static getInstance(): DeviceInfoCollector {
    if (!DeviceInfoCollector.instance) {
      DeviceInfoCollector.instance = new DeviceInfoCollector()
    }
    return DeviceInfoCollector.instance
  }

  async collectDeviceInfo(): Promise<DeviceInfo> {
    if (this.cachedDeviceInfo) {
      return this.cachedDeviceInfo
    }

    try {
      const deviceInfo: DeviceInfo = {
        // Platform info
        platform: this.getPlatform(),
        os: this.getOS(),
        osVersion: this.getOSVersion(),

        // Device specs
        model: await this.getDeviceModel(),
        brand: await this.getDeviceBrand(),
        deviceType: this.getDeviceType(),

        // Screen info
        screenWidth: this.getScreenWidth(),
        screenHeight: this.getScreenHeight(),
        pixelRatio: this.getPixelRatio(),

        // App info
        appVersion: await this.getAppVersion(),
        buildNumber: await this.getBuildNumber(),
        bundleId: await this.getBundleId(),

        // Runtime info
        timezone: this.getTimezone(),
        locale: this.getLocale(),
        userAgent: this.getUserAgent(),
        sessionStartTime: Date.now(),

        // Performance capabilities
        deviceMemory: this.getDeviceMemory(),
        hardwareConcurrency: this.getHardwareConcurrency(),
      }

      this.cachedDeviceInfo = deviceInfo
      return deviceInfo
    } catch (error) {
      // Fallback to basic info if collection fails
      return this.getBasicDeviceInfo()
    }
  }

  createSessionMetadata(sessionId: string): SessionMetadata {
    return {
      sessionId,
      startTime: Date.now(),
      timezone: this.getTimezone(),
      locale: this.getLocale(),

      activeConfig: {
        enableNetworkMonitoring: true,
        enableRenderTracking: true,
        enableListPerformance: true,
        verboseLogging: process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true',
        debugMode: process.env.DEBUG_PERFORMANCE_LOGS === 'true',
      },
    }
  }

  private getPlatform(): 'ios' | 'android' | 'web' {
    if (Platform.OS === 'ios') return 'ios'
    if (Platform.OS === 'android') return 'android'
    return 'web'
  }

  private getOS(): string {
    return Platform.OS || 'unknown'
  }

  private getOSVersion(): string {
    return Platform.Version?.toString() || 'unknown'
  }

  private async getDeviceModel(): Promise<string> {
    try {
      // Try to get device model from React Native device info
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const DeviceInfo = require('react-native-device-info')
      return DeviceInfo.getModel()
    } catch {
      // Fallback for web or if react-native-device-info not available
      if (typeof navigator !== 'undefined') {
        return this.parseModelFromUserAgent(navigator.userAgent)
      }
      return 'unknown'
    }
  }

  private async getDeviceBrand(): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const DeviceInfo = require('react-native-device-info')
      return DeviceInfo.getBrand()
    } catch {
      if (Platform.OS === 'ios') return 'Apple'
      if (Platform.OS === 'android') return 'Android'
      return 'unknown'
    }
  }

  private getDeviceType(): 'phone' | 'tablet' | 'desktop' | 'unknown' {
    try {
      const { width, height } = Dimensions.get('window')
      const minDimension = Math.min(width, height)
      const maxDimension = Math.max(width, height)

      // Simple heuristics for device type
      if (Platform.OS === 'web') {
        return 'desktop'
      }

      // Tablet detection (rough approximation)
      if (minDimension >= 768 || maxDimension >= 1024) {
        return 'tablet'
      }

      return 'phone'
    } catch {
      return 'unknown'
    }
  }

  private getScreenWidth(): number {
    try {
      return Dimensions.get('window').width
    } catch {
      return 0
    }
  }

  private getScreenHeight(): number {
    try {
      return Dimensions.get('window').height
    } catch {
      return 0
    }
  }

  private getPixelRatio(): number {
    try {
      return Dimensions.get('window').scale || 1
    } catch {
      return 1
    }
  }

  private async getAppVersion(): Promise<string> {
    try {
      const DeviceInfo = require('react-native-device-info')
      return DeviceInfo.getVersion()
    } catch {
      // Fallback: try environment variables or hardcoded version
      if (process.env.APP_VERSION) return process.env.APP_VERSION
      if (process.env.REACT_APP_VERSION) return process.env.REACT_APP_VERSION
      if (process.env.VITE_APP_VERSION) return process.env.VITE_APP_VERSION

      // For this specific app, use the known version
      return '1.357.3'
    }
  }

  private async getBuildNumber(): Promise<string> {
    try {
      const DeviceInfo = require('react-native-device-info')
      return DeviceInfo.getBuildNumber()
    } catch {
      // Try to get build number from environment or git commit
      if (process.env.BUILD_NUMBER) return process.env.BUILD_NUMBER
      if (process.env.REACT_APP_BUILD_NUMBER) return process.env.REACT_APP_BUILD_NUMBER
      if (process.env.VITE_BUILD_NUMBER) return process.env.VITE_BUILD_NUMBER

      // Try to get git commit hash as build number
      try {
        const { execSync } = require('child_process')
        const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
        return gitHash
      } catch {
        return '1'
      }
    }
  }

  private async getBundleId(): Promise<string> {
    try {
      const DeviceInfo = require('react-native-device-info')
      return DeviceInfo.getBundleId()
    } catch {
      return process.env.BUNDLE_ID || 'com.passculture.app'
    }
  }

  private getTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return 'UTC'
    }
  }

  private getLocale(): string {
    try {
      if (typeof navigator !== 'undefined') {
        return navigator.language
      }
      return Intl.DateTimeFormat().resolvedOptions().locale
    } catch {
      return 'en-US'
    }
  }

  private getUserAgent(): string | undefined {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent
    }
    return undefined
  }

  private getDeviceMemory(): number | undefined {
    if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
      return navigator.deviceMemory as number | undefined
    }
    return undefined
  }

  private getHardwareConcurrency(): number | undefined {
    if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
      return navigator.hardwareConcurrency
    }
    return undefined
  }

  private parseModelFromUserAgent(userAgent: string): string {
    // Basic model extraction from user agent for web
    const patterns = [
      /iPhone OS [\d_]+ like Mac OS X\) Version\/[\d.]+.*Mobile.*Safari/,
      /Android [\d.]+.*Mobile.*Safari/,
      /iPad.*OS [\d_]+.*like Mac OS X/,
    ]

    for (const pattern of patterns) {
      if (pattern.test(userAgent)) {
        if (userAgent.includes('iPhone')) return 'iPhone'
        if (userAgent.includes('iPad')) return 'iPad'
        if (userAgent.includes('Android')) return 'Android Device'
      }
    }

    return 'Web Browser'
  }

  private getBasicDeviceInfo(): DeviceInfo {
    return {
      platform: this.getPlatform(),
      os: this.getOS(),
      osVersion: this.getOSVersion(),
      model: 'unknown',
      brand: 'unknown',
      deviceType: 'unknown',
      screenWidth: this.getScreenWidth(),
      screenHeight: this.getScreenHeight(),
      pixelRatio: this.getPixelRatio(),
      appVersion: '1.0.0',
      buildNumber: '1',
      bundleId: 'com.passculture.app',
      timezone: this.getTimezone(),
      locale: this.getLocale(),
      sessionStartTime: Date.now(),
    }
  }
}

// Export singleton instance and types
export const deviceInfoCollector = DeviceInfoCollector.getInstance()
export { DeviceInfoCollector }
