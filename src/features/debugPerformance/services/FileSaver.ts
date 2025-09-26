/* eslint-disable @typescript-eslint/no-var-requires */
import { Platform } from 'react-native'

import { webFileDownloader } from '../../../web/debugPerformance/fileDownload'
import { logger } from '../utils/logger'

export interface SaveResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
  size?: number
  platform: 'ios' | 'android' | 'web'
}

export class FileSaver {
  private static instance: FileSaver

  static getInstance(): FileSaver {
    if (!FileSaver.instance) {
      FileSaver.instance = new FileSaver()
    }
    return FileSaver.instance
  }

  async saveExportData(data: unknown, sessionId: string): Promise<SaveResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `debug-performance-${sessionId}-${timestamp}.json`

    try {
      if (Platform.OS === 'web') {
        return await this.saveToWeb(data, fileName)
      } else if (Platform.OS === 'ios') {
        return await this.saveToIOS(data, fileName)
      } else if (Platform.OS === 'android') {
        return await this.saveToAndroid(data, fileName)
      } else {
        return {
          success: false,
          error: `Unsupported platform: ${Platform.OS}`,
          platform: Platform.OS as 'ios' | 'android' | 'web',
        }
      }
    } catch (error) {
      logger.error('❌ File save failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown save error',
        platform: Platform.OS as 'ios' | 'android' | 'web',
      }
    }
  }

  private async saveToWeb(data: unknown, fileName: string): Promise<SaveResult> {
    const result = await webFileDownloader.downloadJSON(data, fileName)

    return {
      success: result.success,
      fileName: result.fileName,
      error: result.error,
      size: result.size,
      platform: 'web',
    }
  }

  private async saveToIOS(data: unknown, fileName: string): Promise<SaveResult> {
    try {
      // Try to use React Native File System
      const RNFS = require('react-native-fs')

      const jsonString = JSON.stringify(data, null, 2)
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`

      await RNFS.writeFile(filePath, jsonString, 'utf8')

      const stats = await RNFS.stat(filePath)

      logger.debug(`✅ iOS save successful: ${filePath}`)

      return {
        success: true,
        filePath,
        fileName,
        size: stats.size,
        platform: 'ios',
      }
    } catch (error) {
      logger.error('❌ iOS save failed:', error)

      // Fallback to basic method
      return await this.fallbackSave(data, fileName, 'ios')
    }
  }

  private async saveToAndroid(data: unknown, fileName: string): Promise<SaveResult> {
    try {
      const RNFS = require('react-native-fs')

      // Check for storage permissions first
      const hasPermission = await this.checkAndroidStoragePermission()
      if (!hasPermission) {
        throw new Error('Storage permission not granted')
      }

      const jsonString = JSON.stringify(data, null, 2)

      // Try to save to Downloads directory
      const downloadsPath =
        RNFS.DownloadDirectoryPath || RNFS.ExternalStorageDirectoryPath + '/Download'
      const filePath = `${downloadsPath}/${fileName}`

      await RNFS.writeFile(filePath, jsonString, 'utf8')

      const stats = await RNFS.stat(filePath)

      logger.debug(`✅ Android save successful: ${filePath}`)

      return {
        success: true,
        filePath,
        fileName,
        size: stats.size,
        platform: 'android',
      }
    } catch (error) {
      logger.error('❌ Android save failed:', error)

      // Try alternative Android save method
      return await this.androidFallbackSave(data, fileName)
    }
  }

  private async checkAndroidStoragePermission(): Promise<boolean> {
    try {
      const { PermissionsAndroid } = require('react-native')

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Debug Performance needs storage access to save export files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )

      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (error) {
      logger.debug('Permission check failed:', error)
      return false
    }
  }

  private async androidFallbackSave(data: unknown, fileName: string): Promise<SaveResult> {
    try {
      const RNFS = require('react-native-fs')

      // Try to save to app's internal directory as fallback
      const jsonString = JSON.stringify(data, null, 2)
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`

      await RNFS.writeFile(filePath, jsonString, 'utf8')

      return {
        success: true,
        filePath,
        fileName,
        size: jsonString.length * 2, // Estimate
        platform: 'android',
      }
    } catch (error) {
      return await this.fallbackSave(data, fileName, 'android')
    }
  }

  private async fallbackSave(
    data: unknown,
    fileName: string,
    platform: 'ios' | 'android'
  ): Promise<SaveResult> {
    // Ultimate fallback - just log the data and provide instructions
    const jsonString = JSON.stringify(data, null, 2)
    const size = jsonString.length * 2

    logger.info(`📱 ${platform.toUpperCase()} File Save Instructions:`)
    logger.info(`📄 File: ${fileName}`)
    logger.info(`📊 Size: ${Math.round(size / 1024)}KB`)
    logger.info('')
    logger.info('💡 Manual save required:')
    logger.info('1. Copy the JSON data from debug logs')
    logger.info('2. Create a new file on your device')
    logger.info('3. Paste the content and save')
    logger.info('')
    logger.info('🔧 To enable automatic saves:')
    logger.info('• Install react-native-fs: npm install react-native-fs')
    logger.info('• Grant storage permissions on Android')
    logger.info('')

    // Log the data in chunks to avoid console limits
    this.logDataInChunks(jsonString)

    return {
      success: false,
      fileName,
      error: 'Automatic save not available, manual copy required',
      size,
      platform,
    }
  }

  private logDataInChunks(data: string, chunkSize = 2000): void {
    logger.info('📁 === EXPORT DATA START ===')

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      const chunkNum = Math.floor(i / chunkSize) + 1
      const totalChunks = Math.ceil(data.length / chunkSize)

      logger.info(`📄 [${chunkNum}/${totalChunks}] ${chunk}`)
    }

    logger.info('📁 === EXPORT DATA END ===')
  }

  // Utility method to get platform-specific save directory info
  getSaveDirectoryInfo(): { platform: string; directory: string; available: boolean } {
    try {
      if (Platform.OS === 'web') {
        return {
          platform: 'web',
          directory: 'Browser Downloads',
          available: true,
        }
      }

      const RNFS = require('react-native-fs')

      if (Platform.OS === 'ios') {
        return {
          platform: 'ios',
          directory: RNFS.DocumentDirectoryPath,
          available: true,
        }
      }

      if (Platform.OS === 'android') {
        return {
          platform: 'android',
          directory: RNFS.DownloadDirectoryPath || RNFS.ExternalStorageDirectoryPath + '/Download',
          available: true,
        }
      }

      return {
        platform: Platform.OS,
        directory: 'unknown',
        available: false,
      }
    } catch (error) {
      return {
        platform: Platform.OS,
        directory: 'unavailable',
        available: false,
      }
    }
  }
}

export const fileSaver = FileSaver.getInstance()
