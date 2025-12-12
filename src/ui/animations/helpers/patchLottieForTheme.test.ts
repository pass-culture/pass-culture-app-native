import { theme } from 'theme'
import { patchLottieForTheme } from 'ui/animations/helpers/patchLottieForTheme'
import { AnimationObject } from 'ui/animations/type'

const makeBaseAnimation = (
  layers: AnimationObject['layers'],
  assets: AnimationObject['assets'] = []
) =>
  ({
    v: '5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    assets,
    layers,
  }) satisfies AnimationObject

const themedColorHex = theme.designSystem.color.background.decorative01
const expectNumber = (value: number | undefined): number => {
  expect(typeof value).toBe('number')

  return value as number
}

describe('patchLottieForTheme', () => {
  it('should recolors flat fills and preserves alpha', () => {
    const animation = makeBaseAnimation([
      {
        shapes: [
          {
            ty: 'fl',
            c: { k: [0, 0, 0, 0.5] },
          },
        ],
      },
    ])

    const patched = patchLottieForTheme(animation, { fill: themedColorHex })
    const patchedColor = (patched.layers[0].shapes[0].c as { k: number[] }).k

    expect(patchedColor[0]).toBeGreaterThan(0)
    expect(patchedColor[1]).toBeGreaterThan(0)
    expect(patchedColor[2]).toBeGreaterThan(0)
    expect(typeof patchedColor[3]).toBe('number')
    expect(animation.layers[0].shapes[0].c.k[0]).toBe(0)
  })

  it('should updates keyframed strokes and keeps keyframe alpha', () => {
    const animation = makeBaseAnimation([
      {
        shapes: [
          {
            ty: 'st',
            c: { k: [{ startValues: [0.1, 0.2, 0.3, 0.2] }] },
          },
        ],
      },
    ])

    const patched = patchLottieForTheme(animation, { fill: themedColorHex })
    const keyframe = (patched.layers[0].shapes[0].c as { k: Array<{ startValues: number[] }> }).k[0]

    expect(expectNumber(keyframe?.startValues[0])).toBeGreaterThan(0)
    expect(expectNumber(keyframe?.startValues[1])).toBeGreaterThan(0)
    expect(expectNumber(keyframe?.startValues[2])).toBeGreaterThan(0)
    expect(typeof keyframe?.startValues[3]).toBe('number')
  })

  it('should patches gradient stops for gradient shapes', () => {
    const animation = makeBaseAnimation([
      {
        shapes: [
          {
            ty: 'gf',
            g: { k: { k: [0, 0.1, 0.2, 0.3, 1, 0.4, 0.5, 0.6] } },
          },
        ],
      },
    ])

    const patched = patchLottieForTheme(animation, { fill: themedColorHex })
    const gradientStops = patched.layers[0].shapes[0].g?.k?.k as number[]

    expect(expectNumber(gradientStops[1])).toBeGreaterThan(0)
    expect(expectNumber(gradientStops[2])).toBeGreaterThan(0)
    expect(expectNumber(gradientStops[3])).toBeGreaterThan(0)
    expect(expectNumber(gradientStops[5])).toBeGreaterThan(0)
    expect(expectNumber(gradientStops[6])).toBeGreaterThan(0)
    expect(expectNumber(gradientStops[7])).toBeGreaterThan(0)
    expect(gradientStops).toHaveLength(8)
  })

  it('should recurses into nested layers and child shapes', () => {
    const animation = makeBaseAnimation(
      [
        {
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'fl',
                  c: { k: [0, 0, 0, 1] },
                },
              ],
              layers: [
                {
                  shapes: [
                    {
                      ty: 'fl',
                      c: { k: [0, 0, 0, 1] },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      [
        {
          layers: [
            {
              shapes: [
                {
                  ty: 'fl',
                  c: { k: [0, 0, 0, 1] },
                },
              ],
            },
          ],
        },
      ]
    )

    const patched = patchLottieForTheme(animation, { fill: themedColorHex })

    const getColor = (node: unknown): number[] => {
      if (typeof node !== 'object' || node === null) return []
      const maybeColor = (node as Record<string, unknown>).c
      if (typeof maybeColor !== 'object' || maybeColor === null) return []
      const value = (maybeColor as Record<string, unknown>).k
      return Array.isArray(value) && value.every((v) => typeof v === 'number') ? value : []
    }

    const groupChildColor = getColor(
      (patched.layers[0].shapes[0] as Record<string, unknown>).it?.[0]
    )
    const nestedLayerColor = getColor(
      (patched.layers[0].shapes[0] as Record<string, unknown>).layers?.[0]?.shapes?.[0]
    )
    const assetColor = getColor(patched.assets?.[0].layers?.[0].shapes?.[0])

    ;[groupChildColor, nestedLayerColor, assetColor].forEach((color) => {
      expect(expectNumber(color[0])).toBeGreaterThan(0)
      expect(expectNumber(color[1])).toBeGreaterThan(0)
      expect(expectNumber(color[2])).toBeGreaterThan(0)
    })
  })
})
