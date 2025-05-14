import { getTagConfig } from 'features/offer/components/InteractionTag/getTagConfig'
import { theme } from 'theme'

describe('getTagConfig', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagConfig({ theme, minLikesValue: 50 })).toEqual(null)
  })

  it('should return the "Reco par les lieux" tag if headlineCount is set and chroniclesCount is not set and likes are below threshold', () => {
    expect(getTagConfig({ theme, headlineCount: 1, minLikesValue: 50, likesCount: 10 })).toEqual({
      label: 'Reco par les lieux',
      backgroundColor: theme.colors.goldLight100,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if headlineCount is set and likesCount >= minLikesValue', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        likesCount: 50,
        minLikesValue: 50,
      })
    ).toEqual({
      label: '50 j’aime',
      backgroundColor: theme.colors.greyLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "Reco du Book Club" tag if headlineCount and chroniclesCount are set and likesCount is below threshold', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        chroniclesCount: 1,
        likesCount: 30,
        minLikesValue: 50,
      })
    ).toEqual({
      label: 'Reco du Book Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if headlineCount and chroniclesCount are set and likesCount >= minLikesValue', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        chroniclesCount: 1,
        likesCount: 100,
        minLikesValue: 50,
      })
    ).toEqual({
      label: '100 j’aime',
      backgroundColor: theme.colors.greyLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if only likesCount is set and >= minLikesValue', () => {
    expect(getTagConfig({ theme, likesCount: 75, minLikesValue: 50 })).toEqual({
      label: '75 j’aime',
      backgroundColor: theme.colors.greyLight,
      Icon: expect.anything(),
    })
  })

  it('should return null if only likesCount is set and < minLikesValue', () => {
    expect(getTagConfig({ theme, likesCount: 10, minLikesValue: 50 })).toEqual(null)
  })

  it('should return the "Reco du Book Club" tag if only chroniclesCount is set', () => {
    expect(getTagConfig({ theme, chroniclesCount: 1, minLikesValue: 50 })).toEqual({
      label: 'Reco du Book Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "Reco par les lieux" tag if only headlineCount is set', () => {
    expect(getTagConfig({ theme, headlineCount: 1, minLikesValue: 50 })).toEqual({
      label: 'Reco par les lieux',
      backgroundColor: theme.colors.goldLight100,
      Icon: expect.anything(),
    })
  })

  it('should use short label when hasSmallLayout is true "Reco lieux"', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        likesCount: 10,
        minLikesValue: 50,
        hasSmallLayout: true,
      })
    ).toEqual({
      label: 'Reco lieux',
      backgroundColor: theme.colors.goldLight100,
      Icon: expect.anything(),
    })
  })

  it('should use short label when hasSmallLayout is true "Reco Club"', () => {
    expect(
      getTagConfig({ theme, chroniclesCount: 1, minLikesValue: 50, hasSmallLayout: true })
    ).toEqual({
      label: 'Reco Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "Bientôt dispo" tag if isComingSoonOffer is true', () => {
    expect(
      getTagConfig({
        theme,
        minLikesValue: 50,
        isComingSoonOffer: true,
      })
    ).toEqual({
      label: 'Bientôt dispo',
      backgroundColor: theme.designSystem.color.background.warning,
      Icon: expect.anything(),
    })
  })
})
