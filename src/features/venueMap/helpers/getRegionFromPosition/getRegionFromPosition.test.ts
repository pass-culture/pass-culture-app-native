import { getRegionFromPosition } from './getRegionFromPosition'

const DEFAULT_REGION = {
  latitude: 48.8666,
  latitudeDelta: 0,
  longitude: 2.3333,
  longitudeDelta: 0.13656059549093744,
}

describe('getRegionFromPosition', () => {
  it('should return default region', () => {
    expect(getRegionFromPosition(null, 0)).toStrictEqual(DEFAULT_REGION)
  })

  it('should return correct region for given position / ratio', () => {
    const ratio = 390 / 844

    expect(
      getRegionFromPosition({ latitude: 48.871728, longitude: 2.308157 }, ratio)
    ).toStrictEqual({
      latitude: 48.871728,
      latitudeDelta: 0.0376813950878418,
      longitude: 2.308157,
      longitudeDelta: 0.12397837355704464,
    })
  })
})
