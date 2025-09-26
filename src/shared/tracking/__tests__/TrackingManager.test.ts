/**
 * Tests pour TrackingManager - Version simplifiée
 */

import { TrackingManager } from '../TrackingManager'

describe('TrackingManager', () => {
  beforeEach(() => {
    // Reset pour chaque test
    TrackingManager.__resetForTesting()
  })

  describe('Basic functionality', () => {
    it('should initialize successfully', () => {
      TrackingManager.initialize()

      const debugInfo = TrackingManager.getDebugInfo()

      expect(debugInfo.isInitialized).toBe(true)
      expect(debugInfo.buffersCount).toBe(0)
    })

    it('should register pages', () => {
      TrackingManager.initialize()

      const pageConfig = {
        pageId: 'page1',
        pageLocation: 'home',
      }

      TrackingManager.registerPage('page1', pageConfig)

      const debugInfo = TrackingManager.getDebugInfo()

      expect(debugInfo.buffersCount).toBe(1)

      const pageBuffer = debugInfo.buffers.find((b) => b.pageId === 'page1')

      expect(pageBuffer).toBeTruthy()
      expect(pageBuffer?.config.pageLocation).toBe('home')
    })

    it('should add tracking data', () => {
      TrackingManager.initialize()

      const pageConfig = {
        pageId: 'page1',
        pageLocation: 'home',
      }

      TrackingManager.registerPage('page1', pageConfig)

      const trackingData = {
        moduleId: 'module1',
        itemType: 'offer' as const,
        items: [{ key: 'item1', index: 0 }],
      }

      TrackingManager.addTrackingData('page1', trackingData)

      const debugInfo = TrackingManager.getDebugInfo()
      const pageBuffer = debugInfo.buffers.find((b) => b.pageId === 'page1')

      expect(pageBuffer?.stats.modulesCount).toBe(1)
      expect(pageBuffer?.stats.modules[0]?.moduleId).toBe('module1')
    })

    it('should unregister pages', () => {
      TrackingManager.initialize()

      const pageConfig = {
        pageId: 'page1',
        pageLocation: 'home',
      }

      TrackingManager.registerPage('page1', pageConfig)

      let debugInfo = TrackingManager.getDebugInfo()

      expect(debugInfo.buffersCount).toBe(1)

      TrackingManager.unregisterPage('page1')

      debugInfo = TrackingManager.getDebugInfo()

      expect(debugInfo.buffersCount).toBe(0)
    })
  })

  describe('Error handling', () => {
    it('should handle non-existent page gracefully', () => {
      TrackingManager.initialize()

      const trackingData = {
        moduleId: 'module1',
        itemType: 'offer' as const,
        items: [{ key: 'item1', index: 0 }],
      }

      // Should not throw
      expect(() => {
        TrackingManager.addTrackingData('nonexistent', trackingData)
      }).not.toThrow()
    })

    it('should handle unregistering non-existent page', () => {
      TrackingManager.initialize()

      // Should not throw
      expect(() => {
        TrackingManager.unregisterPage('nonexistent')
      }).not.toThrow()
    })
  })

  describe('Data isolation', () => {
    it('should isolate data between pages', () => {
      TrackingManager.initialize()

      TrackingManager.registerPage('page1', { pageId: 'page1', pageLocation: 'home' })
      TrackingManager.registerPage('page2', { pageId: 'page2', pageLocation: 'artist' })

      const trackingData1 = {
        moduleId: 'module1',
        itemType: 'offer' as const,
        items: [{ key: 'item1', index: 0 }],
      }

      const trackingData2 = {
        moduleId: 'module2',
        itemType: 'artist' as const,
        items: [{ key: 'item2', index: 0 }],
      }

      TrackingManager.addTrackingData('page1', trackingData1)
      TrackingManager.addTrackingData('page2', trackingData2)

      const debugInfo = TrackingManager.getDebugInfo()
      const page1Buffer = debugInfo.buffers.find((b) => b.pageId === 'page1')
      const page2Buffer = debugInfo.buffers.find((b) => b.pageId === 'page2')

      expect(page1Buffer?.stats.modulesCount).toBe(1)
      expect(page2Buffer?.stats.modulesCount).toBe(1)
      expect(page1Buffer?.stats.modules[0]?.moduleId).toBe('module1')
      expect(page2Buffer?.stats.modules[0]?.moduleId).toBe('module2')
    })
  })
})
