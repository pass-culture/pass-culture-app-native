import type { DebugPerformanceContextType } from '../context/DebugPerformanceProvider'
import { FileSaver } from '../services/FileSaver'
import { LocalExporter } from '../services/LocalExporter'
import { MetricsCollector } from '../services/MetricsCollector'
import { deviceInfoCollector } from '../utils/deviceInfo'
import { logger } from '../utils/logger'
import { getPlatformInfo, testTimingPrecision } from '../utils/performanceTiming'
import { dataSanitizer } from '../utils/sanitization'

import { ConsoleFormatter } from './ConsoleFormatter'

export class CommandHandlers {
  constructor(private context: DebugPerformanceContextType) {}

  async start(): Promise<void> {
    try {
      if (!this.context) {
        logger.error('❌ Context non initialisé. Rechargez la page.')
        return
      }

      if (this.context.isRecording) {
        logger.warn("⚠️ Session d'enregistrement déjà active")
        logger.info('💡 Utilisez window.debugPerf.stop() pour arrêter la session actuelle')
        return
      }

      const success = await this.context.startRecording()
      if (success) {
        const sessionId = this.context.currentSession?.sessionId

        logger.info(`▶️ Enregistrement démarré`)
        logger.debug(`Session ID: ${sessionId ?? 'N/A'}`)

        logger.verbose('🔍 Monitoring actif:')
        logger.verbose('   • 🌐 Requêtes réseau')
        logger.verbose('   • 🎨 Renders de composants')
        logger.verbose('   • 📋 Performance des listes')

        logger.info('💡 Utilisez window.debugPerf.stats() pour voir les métriques')
      } else {
        logger.error("❌ Échec du démarrage de l'enregistrement")
        logger.info('💡 Vérifiez la console pour plus de détails')
      }
    } catch (error) {
      logger.error('❌ Erreur lors du démarrage:', error)
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.context) {
        logger.error('❌ Context non initialisé')
        return
      }

      if (!this.context.isRecording) {
        logger.warn('⚠️ Aucune session active à arrêter')
        logger.info('💡 Utilisez window.debugPerf.start() pour démarrer une session')
        return
      }

      const sessionId = this.context.currentSession?.sessionId
      const startTime = this.context.currentSession?.startTime
      const success = await this.context.stopRecording()

      if (success && startTime) {
        const duration = Date.now() - startTime
        logger.info(`⏹️ Enregistrement arrêté`)

        if (sessionId) {
          ConsoleFormatter.formatSessionSummary(sessionId, duration, {
            networkRequests: this.context.currentSession?.metrics.networkRequests.length || 0,
            renderEvents: this.context.currentSession?.metrics.renderEvents.length || 0,
            listPerformance: this.context.currentSession?.metrics.listPerformance.length || 0,
          })
        }

        logger.info('💡 Utilisez window.debugPerf.export() pour exporter les données')
      } else {
        logger.error("❌ Échec de l'arrêt de l'enregistrement")
      }
    } catch (error) {
      logger.error("❌ Erreur lors de l'arrêt:", error)
    }
  }

  async stats(): Promise<void> {
    try {
      const sessionStats = await this.context.getSessionStats()
      const session = this.context.currentSession
      const metricsCollector = MetricsCollector.getInstance()

      logger.info('📊 Statistiques DebugPerformance:')

      if (this.context.isRecording && session) {
        const duration = Math.round((Date.now() - session.startTime) / 1000)
        logger.info(`🔴 Enregistrement actif (${duration}s)`)
        logger.debug(`Session ID: ${session.sessionId}`)

        // Get real-time metrics from collector
        const currentMetrics = await metricsCollector.getCurrentMetrics()

        logger.info(`📈 Métriques temps réel:`)
        logger.info(`   🌐 ${currentMetrics.networkRequests.length} requêtes réseau`)
        logger.info(`   🎨 ${currentMetrics.renderEvents.length} événements de render`)
        logger.info(`   📋 ${currentMetrics.listPerformance.length} listes surveillées`)

        // Debug info for network requests location
        logger.debug(
          `🔍 Debug - NetworkStorage session: ${this.context.currentSession?.sessionId ?? 'N/A'}`
        )
        logger.debug(
          `🔍 Debug - Requests from getCurrentMetrics: ${currentMetrics.networkRequests.length}`
        )

        if (
          process.env.DEBUG_PERFORMANCE_LOGS === 'true' ||
          process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true'
        ) {
          logger.info('')

          if (currentMetrics.networkRequests.length > 0) {
            ConsoleFormatter.formatNetworkStats(currentMetrics.networkRequests)
          }

          if (currentMetrics.renderEvents.length > 0) {
            ConsoleFormatter.formatRenderStats(currentMetrics.renderEvents)
          }

          if (currentMetrics.listPerformance.length > 0) {
            ConsoleFormatter.formatListStats(currentMetrics.listPerformance)
          }
        }
      } else {
        logger.info('⚪ Aucun enregistrement actif')
      }

      const sessionStatsValue = await sessionStats
      if (sessionStatsValue) {
        logger.info(
          `💾 Stockage: ${sessionStatsValue.totalSessions} sessions, ${sessionStatsValue.storageUsageMB.toFixed(2)} MB`
        )
      }

      logger.verbose('💡 Commandes: start, stop, export, clear, config, logs, help')
    } catch (error) {
      logger.error('❌ Erreur lors de la récupération des statistiques:', error)
    }
  }

  async export(): Promise<void> {
    try {
      if (!this.context.currentSession) {
        logger.info("⚠️ Aucune session à exporter. Démarrez d'abord un enregistrement.")
        logger.info('💡 Utilisez window.debugPerf.start() pour commencer une session')
        return
      }

      const session = this.context.currentSession
      logger.info(`🔄 Génération de l’export pour la session ${session.sessionId}...`)

      // Step 1: Export session data using LocalExporter
      const localExporter = LocalExporter.getInstance()
      const exportResult = await localExporter.exportSession(session.sessionId)

      if (!exportResult) {
        logger.error("❌ Échec de la génération de l'export")
        return
      }

      // Step 2: Enhance with fresh device info
      const currentDeviceInfo = await deviceInfoCollector.collectDeviceInfo()
      exportResult.metadata.device = currentDeviceInfo

      // Step 3: Apply data sanitization with performance-specific config
      logger.info('🧹 Application de la sanitisation des données...')
      logger.info(`📊 Export brut: ${exportResult.data.network.length} requêtes réseau`)
      const perfConfig = dataSanitizer.createPerformanceExportConfig()
      dataSanitizer.setConfig(perfConfig)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedExport = dataSanitizer.sanitizeExportData(exportResult) as any
      logger.info(
        `📊 Export après sanitisation: ${sanitizedExport.data.network.length} requêtes réseau`
      )

      // Validate sanitization
      const validation = dataSanitizer.validateSanitization(sanitizedExport)
      if (!validation.isClean) {
        logger.warn('⚠️ Problèmes de sanitisation détectés:', validation.issues.join(', '))
      }

      // Step 4: Save file using platform-specific method
      const fileSaver = FileSaver.getInstance()
      const saveResult = await fileSaver.saveExportData(sanitizedExport, session.sessionId)

      if (saveResult.success) {
        logger.info(`✅ Export réussi!`)
        logger.info(`📁 Fichier: ${saveResult.fileName ? saveResult.fileName : 'N/A'}`)
        logger.info(`📊 Taille: ${Math.round((saveResult.size || 0) / 1024)}KB`)
        logger.info(`🖥️ Plateforme: ${saveResult.platform}`)

        if (saveResult.filePath) {
          logger.info(`📍 Chemin: ${saveResult.filePath}`)
        }

        // Show export summary
        this.displayExportSummary(sanitizedExport, exportResult.sampling)
      } else {
        logger.error(
          `❌ Échec de la sauvegarde: ${saveResult.error ? saveResult.error : 'Unknown error'}`
        )

        // Fallback to console display
        logger.info('🔄 Basculement vers affichage console...')
        const dataStr = JSON.stringify(sanitizedExport, null, 2)
        const dataSizeKB = Math.round((dataStr.length * 2) / 1024)
        this.displayDataForCopy(dataStr, session.sessionId, dataSizeKB)
      }
    } catch (error) {
      logger.error("❌ Erreur lors de l'export:", error)
      logger.info("💡 Essayez: window.debugPerf.logs('debug') pour plus de détails")
    }
  }

  private displayExportSummary(
    exportData: {
      summary: {
        network: { totalRequests: number; p95ResponseTime?: number; averageRenderTime?: number }
        render: { totalRenders: number; averageRenderTime?: number }
        lists: { totalLists: number }
      }
      metadata: { duration: number }
    },
    sampling: { applied: boolean; originalSize: number; sampledSize: number; strategy: string }
  ): void {
    try {
      const summary = exportData.summary
      const metadata = exportData.metadata

      logger.info('')
      logger.info("📊 Résumé de l'export:")
      logger.info(`⏱️  Durée: ${Math.round(metadata.duration / 1000)}s`)
      logger.info(`🌐 Requêtes réseau: ${summary.network.totalRequests}`)
      logger.info(`🎨 Événements render: ${summary.render.totalRenders}`)
      logger.info(`📋 Listes surveillées: ${summary.lists.totalLists}`)

      if (summary.network.p95ResponseTime) {
        logger.info(`📈 P95 temps réseau: ${Math.round(summary.network.p95ResponseTime)}ms`)
      }

      if (summary.render.averageRenderTime) {
        logger.info(`🎨 Temps render moyen: ${Math.round(summary.render.averageRenderTime)}ms`)
      }

      if (sampling.applied) {
        logger.info('')
        logger.info('⚠️ Échantillonnage appliqué:')
        logger.info(`📏 Taille originale: ${Math.round(sampling.originalSize / (1024 * 1024))}MB`)
        logger.info(`📦 Taille finale: ${Math.round(sampling.sampledSize / (1024 * 1024))}MB`)
        logger.info(`🔧 Stratégie: ${sampling.strategy}`)
      }

      logger.info('')
    } catch (error) {
      logger.debug('Failed to display export summary:', error)
    }
  }

  private displayDataForCopy(dataStr: string, sessionId: string, dataSizeKB: number): void {
    logger.info(`💾 Données prêtes à copier (${dataSizeKB} KB):`)
    logger.info(`📋 Session: ${sessionId}`)
    logger.info('📄 Fichier suggéré: debug-performance-' + sessionId + '.json')
    logger.info('')
    logger.info('🔗 Instructions:')
    logger.info("1. Copiez le JSON ci-dessous (activez d'abord les logs détaillés si besoin)")
    logger.info('2. Collez dans un fichier .json sur votre ordinateur')
    logger.info('3. Ouvrez avec un éditeur JSON ou analysez les données')
    logger.info('')
    logger.info('💡 Pour afficher les données complètes:')
    logger.info('   window.debugPerf.logs("debug") puis relancez l\'export')
    logger.info('')

    // Show a preview of the data
    try {
      const preview = JSON.parse(dataStr)
      logger.info('📊 Aperçu des données:')
      logger.info(`• Session ID: ${preview.sessionId}`)
      logger.info(`• Durée: ${Math.round(preview.duration / 1000)}s`)
      logger.info(`• Requêtes réseau: ${preview.metrics.networkRequests}`)
      logger.info(`• Événements render: ${preview.metrics.renderEvents}`)
      logger.info(`• Listes surveillées: ${preview.metrics.listPerformance}`)
      logger.info(`• Mémoire utilisée: ${preview.metrics.totalMemoryUsageMB}MB`)
      logger.info(`• Plateforme: ${preview.deviceInfo.platform}`)
      logger.info('')
    } catch (error) {
      logger.debug('Error parsing preview:', error)
    }

    // Only show the full data in debug mode to avoid console spam
    const isDebugMode = process.env.DEBUG_PERFORMANCE_LOGS === 'true'
    if (isDebugMode) {
      logger.debug('📁 DONNÉES JSON COMPLÈTES (début):')
      logger.debug('='.repeat(50))
      logger.debug(dataStr)
      logger.debug('='.repeat(50))
      logger.debug('📁 DONNÉES JSON COMPLÈTES (fin)')
    } else {
      logger.info('ℹ️ Activez le mode debug pour voir les données complètes:')
      logger.info('   window.debugPerf.logs("debug")')
    }
  }

  private clearConfirmationPending = false
  private clearConfirmationTimeout: NodeJS.Timeout | null = null

  async clear(): Promise<void> {
    try {
      if (!this.context) {
        logger.error('❌ Context non initialisé')
        return
      }

      const sessionStats = await this.context.getSessionStats()

      if (sessionStats?.totalSessions === 0) {
        logger.info('ℹ️ Aucune donnée à effacer')
        return
      }

      if (this.clearConfirmationPending) {
        if (this.clearConfirmationTimeout) {
          clearTimeout(this.clearConfirmationTimeout)
        }

        this.clearConfirmationPending = false
        await this.context.clearAllData()
        logger.info('✅ Toutes les données de performance ont été effacées')
      } else {
        logger.warn(
          `🗑️ Suppression de ${sessionStats?.totalSessions ?? 0} sessions (${sessionStats?.storageUsageMB?.toFixed(2) ?? 'N/A'} MB)`
        )
        logger.warn('⚠️ Cette action est irréversible!')
        logger.info(
          '💡 Appelez window.debugPerf.clear() de nouveau dans les 5 secondes pour confirmer'
        )

        this.clearConfirmationPending = true

        this.clearConfirmationTimeout = setTimeout(() => {
          this.clearConfirmationPending = false
          logger.info('⏱️ Délai de confirmation expiré')
        }, 5000)
      }
    } catch (error) {
      logger.error("❌ Erreur lors de l'effacement:", error)
      this.clearConfirmationPending = false
    }
  }

  config(settings?: unknown): void {
    try {
      if (settings && typeof settings === 'object') {
        logger.info('⚙️ Mise à jour de configuration...')

        // Validate settings object
        const validSettings = ['enableNetwork', 'enableRender', 'enableList', 'storageLimit']
        const settingsObj = settings as Record<string, unknown>
        const invalidKeys = Object.keys(settingsObj).filter((key) => !validSettings.includes(key))

        if (invalidKeys.length > 0) {
          logger.warn(`⚠️ Clés de configuration invalides: ${invalidKeys.join(', ')}`)
          logger.info(`💡 Clés valides: ${validSettings.join(', ')}`)
        }

        logger.info('ℹ️ La modification de configuration sera disponible dans une future version')
      } else if (settings === undefined) {
        const currentDebug = process.env.DEBUG_PERFORMANCE_LOGS === 'true'
        const currentVerbose = process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true'

        logger.info('⚙️ Configuration actuelle:')
        logger.info('• Mode Dev: ✅')
        logger.info(`• Logs Debug: ${currentDebug ? '✅' : '❌'}`)
        logger.info(`• Logs Verbose: ${currentVerbose ? '✅' : '❌'}`)
        logger.info('• Stockage: 100MB')
        logger.info('• Rétention: 7 jours')
        logger.info('')
        logger.info('📊 Modules actifs:')
        logger.info('• Network Monitoring: ✅')
        logger.info('• Render Tracking: ✅')
        logger.info('• List Performance: ✅')
        logger.info('• Memory Tracking: ✅')
      } else {
        logger.error('❌ Format de configuration invalide. Utilisez un objet.')
        logger.info('💡 Exemple: window.debugPerf.config({enableNetwork: true})')
      }
    } catch (error) {
      logger.error('❌ Erreur de configuration:', error)
    }
  }

  logs(level?: 'info' | 'debug' | 'verbose' | 'off'): void {
    try {
      const currentDebug = process.env.DEBUG_PERFORMANCE_LOGS === 'true'
      const currentVerbose = process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true'

      if (!level) {
        // Show current status and help
        logger.info('📝 Configuration des logs:')
        logger.info(`• Mode DEBUG: ${currentDebug ? '✅' : '❌'} (logs détaillés)`)
        logger.info(`• Mode VERBOSE: ${currentVerbose ? '✅' : '❌'} (logs très détaillés)`)
        logger.info('')
        logger.info('💡 Commandes disponibles:')
        logger.info('• window.debugPerf.logs("info")    - Logs essentiels uniquement')
        logger.info('• window.debugPerf.logs("debug")   - Active les logs de debug')
        logger.info('• window.debugPerf.logs("verbose") - Active tous les logs')
        logger.info('• window.debugPerf.logs("off")     - Désactive tous les logs')
        logger.info('')
        logger.info("⚠️ Redémarrer l'app après changement pour effet complet")
        return
      }

      // Apply the requested level
      switch (level) {
        case 'off':
          process.env.DEBUG_PERFORMANCE_LOGS = 'false'
          process.env.VERBOSE_PERFORMANCE_CONSOLE = 'false'
          logger.info('🔇 Logs désactivés (sauf erreurs)')
          break
        case 'info':
          process.env.DEBUG_PERFORMANCE_LOGS = 'false'
          process.env.VERBOSE_PERFORMANCE_CONSOLE = 'false'
          logger.info('📢 Mode INFO activé (messages essentiels)')
          break
        case 'debug':
          process.env.DEBUG_PERFORMANCE_LOGS = 'true'
          process.env.VERBOSE_PERFORMANCE_CONSOLE = 'false'
          logger.info('🔍 Mode DEBUG activé (logs détaillés)')
          break
        case 'verbose':
          process.env.DEBUG_PERFORMANCE_LOGS = 'true'
          process.env.VERBOSE_PERFORMANCE_CONSOLE = 'true'
          logger.info('📊 Mode VERBOSE activé (tous les logs)')
          break
      }

      logger.info("⚠️ Redémarrez l'application pour que les changements prennent effet")
    } catch (error) {
      logger.error('❌ Erreur lors de la configuration des logs:', error)
    }
  }

  help(): void {
    logger.info('🔧 [DebugPerformance] Interface Console Disponible')
    logger.info('')
    logger.info('📖 DOCUMENTATION:')
    logger.info("• start()     - Démarre l'enregistrement des performances")
    logger.info("• stop()      - Arrête l'enregistrement")
    logger.info('• stats()     - Affiche les statistiques de la session courante')
    logger.info('• export()    - Exporte les données au format JSON')
    logger.info('• clear()     - Efface toutes les données stockées')
    logger.info('• config()    - Affiche la configuration actuelle')
    logger.info('• logs(level) - Contrôle le niveau de logs (info/debug/verbose/off)')
    logger.info('• help()      - Affiche cette aide')
    logger.info('')
    logger.info('🎯 SURVEILLANCE ACTIVE:')
    logger.info('• 🌐 Requêtes réseau (fetch/XHR)')
    logger.info('• 🎨 Performance des renders React')
    logger.info('• 📋 Performance des listes (FlatList/FlashList)')
    logger.info('• 💾 Utilisation mémoire')
    logger.info('')
    logger.info('🚀 DÉMARRAGE RAPIDE:')
    logger.info("1. window.debugPerf.start()  // Démarre l'enregistrement")
    logger.info("2. [Utilisez l'app normalement]")
    logger.info('3. window.debugPerf.stats()  // Vérifiez les métriques')
    logger.info('4. window.debugPerf.export() // Exportez les données')
    logger.info('')
    logger.info('📝 CONTRÔLE DES LOGS:')
    logger.info('• window.debugPerf.logs("debug")   // Active logs détaillés')
    logger.info('• window.debugPerf.logs("verbose") // Active tous les logs')
    logger.info('• window.debugPerf.logs("off")     // Désactive logs verbeux')
    logger.info('')
    logger.info('⏱️ DIAGNOSTICS TIMING:')
    logger.info('• window.debugPerf.timing()       // Test la précision du timing')
  }

  timing(): void {
    try {
      logger.info('⏱️ Test de la précision du timing...')

      const platformInfo = getPlatformInfo()
      logger.info('📱 Informations plateforme:')
      logger.info(`• Plateforme: ${platformInfo.isReactNative ? 'React Native' : 'Web'}`)
      logger.info(`• Méthode de timing: ${platformInfo.timingMethod}`)
      logger.info(`• Précision: ${platformInfo.precision}`)
      logger.info(`• API Performance disponible: ${platformInfo.hasPerformanceAPI ? '✅' : '❌'}`)

      logger.info('')
      logger.info('🎯 Capacités:')
      logger.info(
        `• Micro-benchmarking: ${platformInfo.capabilities.microBenchmarking ? '✅' : '❌'}`
      )
      logger.info(`• Timing réseau: ${platformInfo.capabilities.networkTiming ? '✅' : '❌'}`)
      logger.info(`• Timing render: ${platformInfo.capabilities.renderTiming ? '✅' : '❌'}`)
      logger.info(`• Suivi mémoire: ${platformInfo.capabilities.memoryTracking ? '✅' : '❌'}`)

      logger.info('')
      logger.info('🧪 Test de performance...')

      const testResults = testTimingPrecision()
      logger.info('📊 Résultats du test:')
      logger.info(`• Intervalle court: ${testResults.testResults.shortInterval}ms`)
      logger.info(`• Intervalle moyen: ${testResults.testResults.mediumInterval}ms`)
      logger.info(`• Résolution minimum: ${testResults.testResults.resolution}ms`)

      logger.info('')
      if (testResults.testResults.resolution < 1) {
        logger.info('✅ Excellente précision\u00a0! Timing sub-millisecondes disponible.')
      } else if (testResults.testResults.resolution <= 5) {
        logger.info('⚠️ Précision correcte. Timing millisecondes disponible.')
      } else {
        logger.info('❌ Précision limitée. Considérez installer react-native-performance.')
      }
    } catch (error) {
      logger.error('❌ Erreur lors du test de timing:', error)
    }
  }
}
