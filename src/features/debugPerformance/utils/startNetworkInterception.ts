/**
 * Utility pour démarrer l'interception réseau manuellement
 * À utiliser pour les tests de développement
 */

import { NetworkInterceptor } from '../services/NetworkInterceptor'

import { logger } from './logger'

/**
 * Démarre l'interception réseau avec console logging
 * Appelle cette fonction dans ton code pour tester
 */
export function startNetworkInterception() {
  const interceptor = NetworkInterceptor.getInstance()

  if (interceptor.isInterceptionActive()) {
    logger.debug('Interception réseau déjà active')
    return interceptor
  }

  interceptor.start({
    onRequest: (request) => {
      logger.verbose(`🔄 ${request.method ?? ''} ${request.sanitizedUrl ?? ''}`)
    },
    onResponse: (request) => {
      logger.verbose(`✅ ${request.method} ${request.sanitizedUrl}`, {
        status: request.status.code,
        duration: `${request.timing.duration.toFixed(2)}ms`,
        category: request.category?.category,
        type: request.category?.type,
        priority: request.category?.priority,
        size: `${Math.round((request.size.responseBytes + request.size.requestBytes) / 1024)}KB`,
      })
    },
    onError: (request) => {
      logger.error(`❌ ${request.method} ${request.sanitizedUrl}`, {
        error: request.error?.message,
        duration: `${request.timing.duration.toFixed(2)}ms`,
        status: request.status.code,
      })
    },
  })

  logger.debug('✅ Interception réseau démarrée\u00a0!')
  return interceptor
}

/**
 * Arrête l'interception réseau
 */
export function stopNetworkInterception() {
  const interceptor = NetworkInterceptor.getInstance()
  interceptor.stop()
  logger.debug('⏹️ Interception réseau arrêtée')
}

// Pour faciliter l'utilisation en développement
if (typeof window !== 'undefined' && __DEV__) {
  // @ts-ignore - Pour le debug seulement
  window.startNetworkInterception = startNetworkInterception
  // @ts-ignore - Pour le debug seulement
  window.stopNetworkInterception = stopNetworkInterception

  logger.verbose(
    '🔧 [NetworkInterceptor] Fonctions disponibles: startNetworkInterception(), stopNetworkInterception()'
  )
  logger.debug(
    "Import: import { startNetworkInterception } from 'features/debugPerformance/utils/startNetworkInterception'"
  )
}
