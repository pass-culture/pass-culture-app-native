import { logger } from '../../features/debugPerformance/utils/logger'

export interface FileDownloadResult {
  success: boolean
  fileName?: string
  error?: string
  size?: number
}

export class WebFileDownloader {
  private static instance: WebFileDownloader

  static getInstance(): WebFileDownloader {
    if (!WebFileDownloader.instance) {
      WebFileDownloader.instance = new WebFileDownloader()
    }
    return WebFileDownloader.instance
  }

  async downloadJSON(data: unknown, fileName: string): Promise<FileDownloadResult> {
    try {
      // Check if we're in a web environment with necessary APIs
      if (!this.isWebEnvironment()) {
        return {
          success: false,
          error: 'Web download not supported in this environment',
        }
      }

      const jsonString = JSON.stringify(data, null, 2)
      const size = this.calculateSize(jsonString)

      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'

      // Add to DOM, click, and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      logger.debug(`✅ Web download successful: ${fileName} (${Math.round(size / 1024)}KB)`)

      return {
        success: true,
        fileName,
        size,
      }
    } catch (error) {
      logger.error('❌ Web download failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown download error',
      }
    }
  }

  async downloadText(text: string, fileName: string): Promise<FileDownloadResult> {
    try {
      if (!this.isWebEnvironment()) {
        return {
          success: false,
          error: 'Web download not supported in this environment',
        }
      }

      const size = this.calculateSize(text)
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        fileName,
        size,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown download error',
      }
    }
  }

  // Alternative method for environments where direct download doesn't work
  createDownloadableContent(
    data: unknown,
    _fileName: string
  ): { url: string; cleanup: () => void } | null {
    try {
      if (!this.isWebEnvironment()) {
        return null
      }

      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      return {
        url,
        cleanup: () => URL.revokeObjectURL(url),
      }
    } catch (error) {
      logger.error('❌ Failed to create downloadable content:', error)
      return null
    }
  }

  // Method to copy data to clipboard as fallback
  async copyToClipboard(data: unknown): Promise<boolean> {
    try {
      if (!navigator.clipboard) {
        return this.fallbackCopyToClipboard(JSON.stringify(data, null, 2))
      }

      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      logger.debug('Clipboard API failed, trying fallback:', error)
      return this.fallbackCopyToClipboard(JSON.stringify(data, null, 2))
    }
  }

  private isWebEnvironment(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      typeof Blob !== 'undefined' &&
      typeof URL !== 'undefined'
    )
  }

  private calculateSize(content: string): number {
    // Estimate UTF-8 byte size
    return new Blob([content]).size
  }

  private fallbackCopyToClipboard(text: string): boolean {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'

      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      return true
    } catch (error) {
      logger.error('❌ Fallback clipboard copy failed:', error)
      return false
    }
  }
}

export const webFileDownloader = WebFileDownloader.getInstance()
