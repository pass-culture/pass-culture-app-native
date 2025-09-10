import type { DebugPerformanceContextType } from '../context/DebugPerformanceProvider'
import { MetricsCollector } from '../services/MetricsCollector'
import { logger } from '../utils/logger'
import { getPlatformInfo, testTimingPrecision } from '../utils/performanceTiming'

export class CommandHandlers {
  constructor(private context: DebugPerformanceContextType) {}

  async start(): Promise<void> {
    try {
      if (this.context.isRecording) {
        logger.info("⚠️ Session d'enregistrement déjà active")
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
      }
    } catch (error) {
      logger.error('❌ Erreur lors du démarrage:', error)
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.context.isRecording) {
        logger.info('⚠️ Aucune session active à arrêter')
        return
      }

      const sessionId = this.context.currentSession?.sessionId
      const startTime = this.context.currentSession?.startTime
      const success = await this.context.stopRecording()

      if (success && startTime) {
        const duration = Math.round((Date.now() - startTime) / 1000)
        logger.info(`⏹️ Enregistrement arrêté (${duration}s)`)
        logger.debug(`Session ID: ${sessionId ?? 'N/A'}`)

        logger.verbose('📊 Données collectées: réseau, renders, listes')
        logger.info('💡 Utilisez window.debugPerf.export() pour exporter')
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

        if (currentMetrics.networkRequests.length > 0) {
          const recentRequests = currentMetrics.networkRequests.slice(-3)
          logger.verbose('🌐 Dernières requêtes:')
          recentRequests.forEach((req) => {
            logger.verbose(
              `   • ${req.method} ${req.url} - ${req.status?.code || 'pending'} (${req.timing?.duration}ms)`
            )
          })
        }

        if (currentMetrics.renderEvents.length > 0) {
          const recentRenders = currentMetrics.renderEvents.slice(-3)
          logger.verbose('🎨 Derniers renders:')
          recentRenders.forEach((render) => {
            logger.verbose(
              `   • ${render.componentName} - ${render.renderCount} renders (avg: ${render.actualDuration?.toFixed(1)}ms)`
            )
          })
        }

        if (currentMetrics.listPerformance.length > 0) {
          logger.verbose('📋 Performance des listes:')
          currentMetrics.listPerformance.forEach((list) => {
            logger.verbose(
              `   • ${list.listId} - FPS: ${list.metrics.scrollFPS || 'N/A'}, Items: ${list.metrics.itemCount}`
            )
          })
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
        return
      }

      const session = this.context.currentSession
      const exportData = {
        sessionId: session.sessionId,
        startTime: new Date(session.startTime).toISOString(),
        endTime: session.endTime ? new Date(session.endTime).toISOString() : null,
        duration: session.endTime
          ? session.endTime - session.startTime
          : Date.now() - session.startTime,
        deviceInfo: session.deviceInfo,
        metrics: {
          networkRequests: session.metrics.networkRequests.length,
          renderEvents: session.metrics.renderEvents.length,
          listPerformance: session.metrics.listPerformance.length,
          totalMemoryUsageMB: session.totalMemoryUsageMB,
        },
        status: session.status,
        exportTime: new Date().toISOString(),
      }

      // Create JSON data
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataSizeKB = Math.round((dataStr.length * 2) / 1024) // Rough estimate in KB

      // Check platform capabilities
      const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
      const hasWebAPIs =
        typeof window !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined'

      if (!isReactNative && hasWebAPIs && window.document) {
        // Web environment - create downloadable file
        try {
          const blob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = url
          link.download = `debug-performance-${session.sessionId}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          logger.info(
            `💾 Export réussi: debug-performance-${session.sessionId}.json (${dataSizeKB} KB)`
          )
        } catch (error) {
          logger.error('❌ Échec du téléchargement web, fallback vers affichage:', error)
          this.displayDataForCopy(dataStr, session.sessionId, dataSizeKB)
        }
      } else {
        // React Native or limited web environment
        logger.info('📱 Export des données (React Native/Mobile):')
        this.displayDataForCopy(dataStr, session.sessionId, dataSizeKB)
      }
    } catch (error) {
      logger.error("❌ Erreur lors de l'export:", error)
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

  async clear(): Promise<void> {
    try {
      const sessionStats = await this.context.getSessionStats()

      if (sessionStats?.totalSessions === 0) {
        logger.info('ℹ️ Aucune donnée à effacer')
        return
      }

      logger.info(
        `🗑️ Suppression de ${sessionStats?.totalSessions ?? 0} sessions (${sessionStats?.storageUsageMB?.toFixed(2) ?? 'N/A'} MB)`
      )
      logger.info('⚠️ Cette action est irréversible!')
      logger.info('💡 Appelez window.debugPerf.clear() de nouveau pour confirmer')

      // Simple confirmation mechanism for console
      const confirmKey = `debugPerf_clearConfirm_${Date.now()}`
      window[confirmKey] = true

      setTimeout(async () => {
        if (!window[confirmKey]) {
          return
        }
        await this.context.clearAllData()
        logger.info('✅ Toutes les données de performance ont été effacées')
        delete window[confirmKey]
      }, 100)
    } catch (error) {
      logger.error("❌ Erreur lors de l'effacement:", error)
    }
  }

  config(settings?: unknown): void {
    try {
      if (settings) {
        logger.info('⚙️ Demande de mise à jour de configuration:', settings)
        logger.info('ℹ️ Gestion de configuration à implémenter dans futures versions')
      } else {
        logger.info('⚙️ Configuration actuelle:')
        logger.info('• Tracking: ✅ | Mode Dev: ✅ | Stockage: 100MB | Rétention: 7j')
        logger.verbose('• Network Monitoring: ✅')
        logger.verbose('• Render Tracking: ✅')
        logger.verbose('• List Performance: ✅')
        logger.debug('Utilisez window.debugPerf.config({key: value}) pour modifier (future)')
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
