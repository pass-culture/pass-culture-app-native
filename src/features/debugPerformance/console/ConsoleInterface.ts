import type { DebugPerformanceContextType } from '../context/DebugPerformanceProvider'
import { logger } from '../utils/logger'

import { CommandHandlers } from './CommandHandlers'

declare global {
  interface Window {
    debugPerf?: ConsoleCommands
  }
}

interface ConsoleCommands {
  start(): void
  stop(): void
  stats(): void
  export(): void
  clear(): void
  config(settings?: unknown): void
  logs(level?: 'info' | 'debug' | 'verbose' | 'off'): void
  help(): void
}

class ConsoleInterface {
  private static instance: ConsoleInterface | null = null
  private context: DebugPerformanceContextType | null = null
  private commandHandlers: CommandHandlers | null = null

  static getInstance(): ConsoleInterface {
    if (!ConsoleInterface.instance) {
      ConsoleInterface.instance = new ConsoleInterface()
    }
    return ConsoleInterface.instance
  }

  initialize(context: DebugPerformanceContextType): void {
    this.context = context
    this.commandHandlers = new CommandHandlers(context)

    if (__DEV__ && typeof window !== 'undefined') {
      window.debugPerf = {
        start: () => this.start(),
        stop: () => this.stop(),
        stats: () => this.stats(),
        export: () => this.export(),
        clear: () => this.clear(),
        config: (settings?: unknown) => this.config(settings),
        logs: (level?: 'info' | 'debug' | 'verbose' | 'off') => this.logs(level),
        help: () => this.help(),
      }

      // Display welcome message
      this.displayWelcome()
    }
  }

  private start(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.start()
  }

  private stop(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.stop()
  }

  private stats(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.stats()
  }

  private export(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.export()
  }

  private clear(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.clear()
  }

  private config(settings?: unknown): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.config(settings)
  }

  private logs(level?: 'info' | 'debug' | 'verbose' | 'off'): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.logs(level)
  }

  private help(): void {
    if (!this.commandHandlers) {
      logger.error('❌ Debug performance not initialized')
      return
    }
    this.commandHandlers.help()
  }

  private displayWelcome(): void {
    const currentDebug = process.env.DEBUG_PERFORMANCE_LOGS === 'true'
    const currentVerbose = process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true'

    logger.info('🔧 [DebugPerformance] Interface Console Disponible')
    logger.info('💡 Tapez window.debugPerf.help() pour voir la documentation complète')
    logger.info('')
    logger.info('🚀 DÉMARRAGE RAPIDE:')
    logger.info("• window.debugPerf.start()   - Démarre l'enregistrement")
    logger.info('• window.debugPerf.stats()   - Vérifiez les métriques')
    logger.info('• window.debugPerf.export()  - Exportez les données')
    logger.info('')
    logger.info(
      `📝 LOGS: DEBUG ${currentDebug ? '✅' : '❌'} | VERBOSE ${currentVerbose ? '✅' : '❌'}`
    )
    logger.info('• window.debugPerf.logs("debug")   - Active logs détaillés')
    logger.info('• window.debugPerf.logs("verbose") - Active tous les logs')
    logger.info('')
  }
}

export default ConsoleInterface
