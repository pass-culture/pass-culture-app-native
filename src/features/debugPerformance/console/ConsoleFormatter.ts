import { ListPerformance, NetworkRequest, RenderEvent } from '../types'
import { logger } from '../utils/logger'

export class ConsoleFormatter {
  static formatSessionSummary(
    sessionId: string,
    duration: number,
    metrics: { networkRequests: number; renderEvents: number; listPerformance: number }
  ): void {
    logger.info('═══════════════════════════════════════════════════')
    logger.info(`📊 Session: ${sessionId}`)
    logger.info(`⏱️  Durée: ${Math.round(duration / 1000)}s`)
    logger.info('═══════════════════════════════════════════════════')

    if (metrics) {
      logger.info(`🌐 Requêtes réseau: ${metrics.networkRequests || 0}`)
      logger.info(`🎨 Événements render: ${metrics.renderEvents || 0}`)
      logger.info(`📋 Listes surveillées: ${metrics.listPerformance || 0}`)
    }
  }

  static formatNetworkStats(requests: NetworkRequest[]): void {
    if (requests.length === 0) {
      logger.info('  Aucune requête réseau')
      return
    }

    const stats = this.calculateNetworkStats(requests)

    logger.info('┌─────────────────────────────────────────────────┐')
    logger.info('│               STATISTIQUES RÉSEAU               │')
    logger.info('├─────────────────────────────────────────────────┤')
    logger.info(`│ Total requêtes\u00a0: ${stats.total.toString().padEnd(27)}│`)
    logger.info(`│ Succès (2xx)\u00a0: ${stats.success.toString().padEnd(27)}│`)
    logger.info(`│ Erreurs (4xx/5xx)\u00a0: ${stats.errors.toString().padEnd(27)}│`)
    logger.info(`│ En cours\u00a0: ${stats.pending.toString().padEnd(27)}│`)
    logger.info('├─────────────────────────────────────────────────┤')
    logger.info(`│ Temps moyen\u00a0: ${stats.avgTime}ms`.padEnd(50) + '│')
    logger.info(`│ Temps médian\u00a0: ${stats.medianTime}ms`.padEnd(50) + '│')
    logger.info(`│ P95\u00a0: ${stats.p95Time}ms`.padEnd(50) + '│')
    logger.info(`│ P99\u00a0: ${stats.p99Time}ms`.padEnd(50) + '│')
    logger.info('└─────────────────────────────────────────────────┘')

    if (process.env.DEBUG_PERFORMANCE_LOGS === 'true') {
      this.formatTopRequests(requests)
    }
  }

  static formatRenderStats(events: RenderEvent[]): void {
    if (events.length === 0) {
      logger.info('  Aucun événement de render')
      return
    }

    const componentStats = this.calculateRenderStats(events)

    logger.info('┌─────────────────────────────────────────────────┐')
    logger.info('│            STATISTIQUES DES RENDERS             │')
    logger.info('├─────────────────────────────────────────────────┤')

    const sortedComponents = Object.entries(componentStats)
      .sort((a, b) => b[1].totalTime - a[1].totalTime)
      .slice(0, 5)

    sortedComponents.forEach(([name, stats]) => {
      const line = `│ ${name.substring(0, 20).padEnd(20)}\u00a0: ${stats.count} renders, ${stats.avgTime.toFixed(1)}ms avg`
      logger.info(line.padEnd(50) + '│')
    })

    logger.info('└─────────────────────────────────────────────────┘')
  }

  static formatListStats(listData: ListPerformance[]): void {
    if (listData.length === 0) {
      logger.info('  Aucune liste surveillée')
      return
    }

    logger.info('┌─────────────────────────────────────────────────┐')
    logger.info('│           PERFORMANCE DES LISTES                │')
    logger.info('├─────────────────────────────────────────────────┤')

    listData.forEach((list) => {
      const fps = list.metrics.scrollFPS || 'N/A'
      const items = list.metrics.itemCount || 0
      const visible = list.metrics.visibleItemCount || 0

      logger.info(`│ ${list.listId.substring(0, 20).padEnd(20)}`.padEnd(50) + '│')
      logger.info(`│   FPS: ${fps}, Items: ${items}/${visible} visible`.padEnd(50) + '│')
    })

    logger.info('└─────────────────────────────────────────────────┘')
  }

  static formatProgressBar(current: number, total: number, width = 30): string {
    const percentage = Math.round((current / total) * 100)
    const filled = Math.round((current / total) * width)
    const empty = width - filled

    return `[${'█'.repeat(filled)}${' '.repeat(empty)}] ${percentage}%`
  }

  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'

    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i] ?? 'N/A'}`
  }

  static formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`

    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  private static calculateNetworkStats(requests: NetworkRequest[]) {
    const completed = requests.filter((r) => r.status?.code)
    const times = completed
      .map((r) => r.timing?.duration || 0)
      .filter((t) => t > 0)
      .sort((a, b) => a - b)

    return {
      total: requests.length,
      success: completed.filter((r) => r.status?.code >= 200 && r.status?.code < 300).length,
      errors: completed.filter((r) => r.status?.code >= 400).length,
      pending: requests.filter((r) => !r.status?.code).length,
      avgTime: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
      medianTime: times.length > 0 ? Math.round(times[Math.floor(times.length / 2)] ?? 0) : 0,
      p95Time: times.length > 0 ? Math.round(times[Math.floor(times.length * 0.95)] ?? 0) : 0,
      p99Time: times.length > 0 ? Math.round(times[Math.floor(times.length * 0.99)] ?? 0) : 0,
    }
  }

  private static calculateRenderStats(events: RenderEvent[]) {
    const componentStats: Record<string, { count: number; totalTime: number; avgTime: number }> = {}

    events.forEach((event) => {
      if (!componentStats[event.componentName]) {
        componentStats[event.componentName] = { count: 0, totalTime: 0, avgTime: 0 }
      }

      const stats = componentStats[event.componentName]
      if (stats) {
        stats.count = event.renderCount
        stats.totalTime += event.actualDuration || 0
        stats.avgTime = event.actualDuration || 0
      }
    })

    return componentStats
  }

  private static formatTopRequests(requests: NetworkRequest[]): void {
    const sortedByTime = [...requests]
      .filter((r) => r.timing?.duration)
      .sort((a, b) => (b.timing?.duration || 0) - (a.timing?.duration || 0))
      .slice(0, 5)

    if (sortedByTime.length > 0) {
      logger.debug('')
      logger.debug('🐢 Top 5 requêtes les plus lentes:')
      sortedByTime.forEach((req, i) => {
        const url = req.url
          ? req.url.length > 50
            ? '...' + req.url.slice(-47)
            : req.url
          : 'unknown-url'
        logger.debug(`  ${i + 1}. ${req.method || 'UNKNOWN'} ${url}`)
        logger.debug(`     ${req.timing?.duration || 0}ms - ${req.status?.code || 'pending'}`)
      })
    }
  }

  static formatMemoryStats(memoryUsageMB: number, limit = 100): void {
    const percentage = (memoryUsageMB / limit) * 100
    const progressBar = this.formatProgressBar(memoryUsageMB, limit, 20)

    logger.info('💾 Utilisation mémoire:')
    logger.info(`   ${progressBar} ${memoryUsageMB.toFixed(2)}MB / ${limit}MB`)

    if (percentage > 80) {
      logger.warn('⚠️  Attention: Utilisation mémoire élevée!')
    }
  }

  static formatTableData(headers: string[], rows: string[][]): void {
    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] || '').length))
    )

    const separator = '├' + colWidths.map((w) => '─'.repeat(w + 2)).join('┼') + '┤'
    const topBorder = '┌' + colWidths.map((w) => '─'.repeat(w + 2)).join('┬') + '┐'
    const bottomBorder = '└' + colWidths.map((w) => '─'.repeat(w + 2)).join('┴') + '┘'

    logger.info(topBorder)
    logger.info('│ ' + headers.map((h, i) => h.padEnd(colWidths[i] ?? 0)).join(' │ ') + ' │')
    logger.info(separator)

    rows.forEach((row) => {
      logger.info(
        '│ ' + row.map((cell, i) => (cell || '').padEnd(colWidths[i] ?? 0)).join(' │ ') + ' │'
      )
    })

    logger.info(bottomBorder)
  }
}
