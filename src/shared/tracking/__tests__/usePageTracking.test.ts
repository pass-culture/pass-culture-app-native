/**
 * Unit tests for usePageTracking hook - Version corrigée
 */

import { useFocusEffect } from '@react-navigation/native'

import { analytics } from 'libs/analytics/provider'
import { renderHook, act } from 'tests/utils'

import { setViewOfferTrackingFn } from '../../analytics/logViewItem'
import { AppLifecycleManager } from '../AppLifecycleManager'
import { TrackingManager } from '../TrackingManager'
import { usePageTracking } from '../usePageTracking'

// Mock dependencies - garder simple
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

jest.mock('../TrackingManager', () => ({
  TrackingManager: {
    initialize: jest.fn(),
    registerPage: jest.fn(),
    addTrackingData: jest.fn(),
    unregisterPage: jest.fn(),
    getDebugInfo: jest.fn(() => ({ isInitialized: true, buffersCount: 0, buffers: [] })),
    __resetForTesting: jest.fn(),
  },
}))

jest.mock('../AppLifecycleManager', () => ({
  AppLifecycleManager: {
    setActivePage: jest.fn(),
  },
}))

jest.mock('../TrackingLogger', () => ({
  TrackingLogger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../analytics/logViewItem', () => ({
  setViewOfferTrackingFn: jest.fn(),
}))

jest.mock('libs/analytics/provider', () => ({
  analytics: {
    logViewItem: jest.fn(),
  },
}))

describe('usePageTracking', () => {
  const mockUseFocusEffect = useFocusEffect as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseFocusEffect.mockImplementation((callback) => {
      // Simuler le callback simplement
      callback()
    })
  })

  describe('Basic Functionality', () => {
    it('should initialize tracking system', () => {
      const config = {
        pageName: 'Home',
        pageLocation: 'home',
        pageId: 'page1',
      }

      renderHook(() => usePageTracking(config))

      expect(TrackingManager.initialize).toHaveBeenCalledWith()
      expect(setViewOfferTrackingFn).toHaveBeenCalledWith(analytics.logViewItem)
    })

    it('should register page correctly', () => {
      const config = {
        pageName: 'Home',
        pageLocation: 'home',
        pageId: 'page1',
      }

      renderHook(() => usePageTracking(config))

      expect(TrackingManager.registerPage).toHaveBeenCalledWith(
        'page1',
        expect.objectContaining({
          pageId: 'page1',
          pageLocation: 'home',
        })
      )
      expect(AppLifecycleManager.setActivePage).toHaveBeenCalledWith('page1')
    })

    it('should provide trackViewableItems function', () => {
      const config = {
        pageName: 'Home',
        pageLocation: 'home',
        pageId: 'page1',
      }

      const { result } = renderHook(() => usePageTracking(config))

      expect(typeof result.current.trackViewableItems).toBe('function')
    })

    it('should track viewable items correctly', () => {
      const config = {
        pageName: 'Home',
        pageLocation: 'home',
        pageId: 'page1',
      }

      const { result } = renderHook(() => usePageTracking(config))

      const trackingData = {
        moduleId: 'module1',
        itemType: 'offer' as const,
        viewableItems: [{ key: 'item1', index: 0 }],
      }

      act(() => {
        result.current.trackViewableItems(trackingData)
      })

      expect(TrackingManager.addTrackingData).toHaveBeenCalledWith(
        'page1',
        expect.objectContaining({
          moduleId: 'module1',
          itemType: 'offer',
          items: [{ key: 'item1', index: 0 }],
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle tracking errors gracefully', () => {
      const config = {
        pageName: 'Home',
        pageLocation: 'home',
        pageId: 'page1',
      }

      const { result } = renderHook(() => usePageTracking(config))

      // Mock pour faire échouer une seule fois
      ;(TrackingManager.addTrackingData as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Tracking error')
      })

      const trackingData = {
        moduleId: 'module1',
        itemType: 'offer' as const,
        viewableItems: [{ key: 'item1', index: 0 }],
      }

      // Should not throw - la fonction doit gérer l'erreur
      expect(() => {
        act(() => {
          result.current.trackViewableItems(trackingData)
        })
      }).not.toThrow()
    })
  })

  describe('PageId generation', () => {
    it('should use provided pageId when given', () => {
      const config = {
        pageName: 'Artist',
        pageLocation: 'artist',
        pageId: 'artist123', // PageId explicite
      }

      renderHook(() => usePageTracking(config))

      expect(TrackingManager.registerPage).toHaveBeenCalledWith(
        'artist123',
        expect.objectContaining({
          pageId: 'artist123',
        })
      )
    })

    it('should generate pageId when not provided', () => {
      const config = {
        pageName: 'Artist',
        pageLocation: 'artist',
        // pageId omis - sera généré automatiquement
      }

      renderHook(() => usePageTracking(config))

      // Le pageId généré devrait contenir "artist"
      expect(TrackingManager.registerPage).toHaveBeenCalledWith(
        expect.stringContaining('artist'),
        expect.objectContaining({
          pageId: expect.stringContaining('artist'),
        })
      )
    })
  })
})
