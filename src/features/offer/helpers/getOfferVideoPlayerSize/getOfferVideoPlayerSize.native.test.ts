import { RATIO169, RATIO916 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { MAX_HEIGHT_VIDEO_PORTRAIT, MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { getOfferVideoPlayerSize } from 'features/offer/helpers/getOfferVideoPlayerSize/getOfferVideoPlayerSize'

describe('getOfferVideoPlayerSize', () => {
  describe('landscape', () => {
    it('should let the player take the full width when the viewport is narrower than maxWidth', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 375,
        maxWidth: MAX_WIDTH_VIDEO,
      })

      expect(width).toBeUndefined()
      expect(height).toBe(375 * RATIO169)
    })

    it('should cap the player to maxWidth when the viewport is wider', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 1200,
        maxWidth: MAX_WIDTH_VIDEO,
      })

      expect(width).toBe(MAX_WIDTH_VIDEO)
      expect(height).toBe(MAX_WIDTH_VIDEO * RATIO169)
    })

    it('should use the given playerRatio', () => {
      const { height } = getOfferVideoPlayerSize({
        viewportWidth: 375,
        maxWidth: MAX_WIDTH_VIDEO,
        playerRatio: 1,
      })

      expect(height).toBe(375)
    })
  })

  describe('portrait', () => {
    const MOBILE_VIEWPORT_WIDTH = 375
    const MOBILE_HORIZONTAL_MARGIN = 24
    const CONTENT_WIDTH = MOBILE_VIEWPORT_WIDTH - 2 * MOBILE_HORIZONTAL_MARGIN

    it('should span the whole content width when no height limit is given', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: MOBILE_VIEWPORT_WIDTH,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        horizontalMargin: MOBILE_HORIZONTAL_MARGIN,
      })

      expect(width).toBe(CONTENT_WIDTH)
      expect(height).toBe(CONTENT_WIDTH * RATIO916)
    })

    it('should keep the same horizontal margins when the height limit is not reached', () => {
      const { width } = getOfferVideoPlayerSize({
        viewportWidth: MOBILE_VIEWPORT_WIDTH,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        horizontalMargin: MOBILE_HORIZONTAL_MARGIN,
        maxHeight: 2000,
      })

      expect(width).toBe(CONTENT_WIDTH)
    })

    it('should shrink the player so it never exceeds maxHeight', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: MOBILE_VIEWPORT_WIDTH,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        horizontalMargin: MOBILE_HORIZONTAL_MARGIN,
        maxHeight: 400,
      })

      expect(height).toBe(400)
      expect(width).toBe(400 / RATIO916)
    })

    it('should cap the height to MAX_HEIGHT_VIDEO_PORTRAIT on desktop', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 1200,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        maxHeight: MAX_HEIGHT_VIDEO_PORTRAIT,
      })

      expect(width).toBe(MAX_HEIGHT_VIDEO_PORTRAIT / RATIO916)
      expect(height).toBe(MAX_HEIGHT_VIDEO_PORTRAIT)
    })

    it('should never exceed maxWidth', () => {
      const { width } = getOfferVideoPlayerSize({
        viewportWidth: 2000,
        maxWidth: 100,
        isPortrait: true,
      })

      expect(width).toBe(100)
    })

    it('should not overflow a narrow viewport', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 200,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
      })

      expect(width).toBe(200)
      expect(height).toBe(200 * RATIO916)
    })

    it('should always return an explicit width so the player can be aligned', () => {
      const { width } = getOfferVideoPlayerSize({
        viewportWidth: MOBILE_VIEWPORT_WIDTH,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
      })

      expect(width).toBeDefined()
    })

    it('should never return a negative size when maxHeight is zero', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: MOBILE_VIEWPORT_WIDTH,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        maxHeight: 0,
      })

      expect(width).toBe(0)
      expect(height).toBe(0)
    })

    it('should never return a negative size when the viewport is smaller than its margins', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 20,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        horizontalMargin: MOBILE_HORIZONTAL_MARGIN,
      })

      expect(width).toBe(0)
      expect(height).toBe(0)
    })
  })
})
