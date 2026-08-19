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
    it('should cap the player height to MAX_HEIGHT_VIDEO_PORTRAIT', () => {
      const { width, height } = getOfferVideoPlayerSize({
        viewportWidth: 1200,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
      })

      expect(width).toBe(MAX_HEIGHT_VIDEO_PORTRAIT / RATIO916)
      expect(height).toBe(MAX_HEIGHT_VIDEO_PORTRAIT)
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

    it('should always return an explicit width so the player can be centered', () => {
      const { width } = getOfferVideoPlayerSize({
        viewportWidth: 375,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
      })

      expect(width).toBeDefined()
    })

    it('should ignore playerRatio', () => {
      const { height } = getOfferVideoPlayerSize({
        viewportWidth: 200,
        maxWidth: MAX_WIDTH_VIDEO,
        isPortrait: true,
        playerRatio: 1,
      })

      expect(height).toBe(200 * RATIO916)
    })
  })
})
