import { interpolateKeyframes } from 'shared/animations/interpolateKeyframes'

const track = [
  { at: 100, value: 0 },
  { at: 200, value: 10 },
  { at: 300, value: 4 },
]

describe('interpolateKeyframes', () => {
  it('should hold the first value before the first keyframe', () => {
    expect(interpolateKeyframes(0, track)).toBe(0)
  })

  it('should hold the last value after the last keyframe', () => {
    expect(interpolateKeyframes(1000, track)).toBe(4)
  })

  it('should return the keyframe value on a keyframe', () => {
    expect(interpolateKeyframes(200, track)).toBe(10)
  })

  it('should be halfway between two keyframes at mid-time', () => {
    expect(interpolateKeyframes(250, track)).toBe(7)
  })

  it('should ease in and out between two keyframes', () => {
    expect(interpolateKeyframes(125, track)).toBeCloseTo(1.5625)
    expect(interpolateKeyframes(175, track)).toBeCloseTo(8.4375)
  })
})
