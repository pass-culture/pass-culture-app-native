import { getTagConfig } from 'features/offer/components/InteractionTag/getTagConfig'
import { theme } from 'theme'

describe('getTagConfig', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagConfig({ theme, minLikesValue: 20, maxLikesValue: 50 })).toEqual(null)
  })

  it('should return the "Reco par les lieux" tag if headlineCount is set and chroniclesCount is not set', () => {
    expect(getTagConfig({ theme, headlineCount: 1, minLikesValue: 20, maxLikesValue: 50 })).toEqual(
      {
        label: 'Reco par les lieux',
        backgroundColor: theme.colors.goldLight100,
        Icon: expect.anything(),
      }
    )
  })

  it('should return the "Reco par les lieux" tag if headlineCount is set but likesCount is lower than minLikesValues', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        likesCount: 10,
        minLikesValue: 20,
        maxLikesValue: 50,
      })
    ).toEqual({
      label: 'Reco par les lieux',
      backgroundColor: theme.colors.goldLight100,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if headlineCount is set and likesCount is >= minLikesValue', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        likesCount: 20,
        minLikesValue: 20,
        maxLikesValue: 50,
      })
    ).toEqual({
      label: '20 j’aime',
      backgroundColor: theme.colors.white,
      Icon: expect.anything(),
    })
  })

  it('should return the "Reco du Book Club" tag if both headlineCount and chroniclesCount are set and likesCount is < maxLikesValue', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        chroniclesCount: 1,
        likesCount: 40,
        minLikesValue: 20,
        maxLikesValue: 50,
      })
    ).toEqual({
      label: 'Reco du Book Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if both headlineCount and chroniclesCount are set and likesCount is >= maxLikesValue', () => {
    expect(
      getTagConfig({
        theme,
        headlineCount: 1,
        chroniclesCount: 1,
        likesCount: 50,
        minLikesValue: 20,
        maxLikesValue: 50,
      })
    ).toEqual({
      label: '50 j’aime',
      backgroundColor: theme.colors.white,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if likesCount is set without headlineCount or chroniclesCount', () => {
    expect(getTagConfig({ theme, likesCount: 15, minLikesValue: 20, maxLikesValue: 50 })).toEqual({
      label: '15 j’aime',
      backgroundColor: theme.colors.white,
      Icon: expect.anything(),
    })
  })

  it('should return the "Reco du Book Club" tag if chroniclesCount is set without headlineCount or likesCount', () => {
    expect(
      getTagConfig({ theme, chroniclesCount: 1, minLikesValue: 20, maxLikesValue: 50 })
    ).toEqual({
      label: 'Reco du Book Club',
      backgroundColor: theme.colors.skyBlueLight,
      Icon: expect.anything(),
    })
  })
})
