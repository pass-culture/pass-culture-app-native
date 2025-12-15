import { theme } from 'theme'
import { patchNamedShapes } from 'ui/animations/helpers/patchNamedShapes'
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

describe('patchNamedShapes', () => {
  it('should recolors only matching shape names', () => {
    const animation = makeBaseAnimation([
      {
        nm: 'layer',
        shapes: [
          { nm: 'Fond 1', c: { k: [0, 0, 0, 0.4] } },
          { nm: 'Other', c: { k: [0.5, 0.5, 0.5, 0.4] } },
        ],
      },
    ])

    const patched = patchNamedShapes(animation, ['Fond 1'], themedColorHex)
    const fondColor = (patched.layers[0].shapes[0].c as { k: number[] }).k
    const otherColor = (patched.layers[0].shapes[1].c as { k: number[] }).k

    expect(fondColor[0]).toBeGreaterThan(0)
    expect(fondColor[1]).toBeGreaterThan(0)
    expect(fondColor[2]).toBeGreaterThan(0)
    expect(typeof fondColor[3]).toBe('number')
    expect(otherColor).toEqual([0.5, 0.5, 0.5, 0.4])
    expect(animation.layers[0].shapes[0].c.k[0]).toBe(0)
  })

  it('should respects targetLayerNames filter', () => {
    const animation = makeBaseAnimation([
      { nm: 'skip', shapes: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }] },
      { nm: 'apply here', shapes: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }] },
    ])

    const patched = patchNamedShapes(animation, ['Fond 1'], themedColorHex, {
      targetLayerNames: ['apply'],
    })

    const skippedColor = (patched.layers[0].shapes[0].c as { k: number[] }).k
    const appliedColor = (patched.layers[1].shapes[0].c as { k: number[] }).k

    expect(skippedColor).toEqual([0, 0, 0, 1])
    expect(appliedColor[0]).toBeGreaterThan(0)
    expect(appliedColor[1]).toBeGreaterThan(0)
    expect(appliedColor[2]).toBeGreaterThan(0)
  })

  it('should patches gradient stops on matching shapes', () => {
    const animation = makeBaseAnimation([
      {
        shapes: [
          {
            nm: 'Fond 1',
            ty: 'gf',
            g: { k: { k: [0, 0.1, 0.2, 0.3, 1, 0.4, 0.5, 0.6] } },
          },
        ],
      },
    ])

    const patched = patchNamedShapes(animation, ['Fond 1'], themedColorHex)
    const stops = patched.layers[0].shapes[0].g?.k?.k as number[]

    expect(expectNumber(stops[1])).toBeGreaterThan(0)
    expect(expectNumber(stops[2])).toBeGreaterThan(0)
    expect(expectNumber(stops[3])).toBeGreaterThan(0)
    expect(expectNumber(stops[5])).toBeGreaterThan(0)
    expect(expectNumber(stops[6])).toBeGreaterThan(0)
    expect(expectNumber(stops[7])).toBeGreaterThan(0)
  })

  it('should recurses into children, nested layers, and assets', () => {
    const animation = makeBaseAnimation(
      [
        {
          nm: 'root',
          shapes: [
            {
              nm: 'group',
              it: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }],
              layers: [
                {
                  shapes: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }],
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
              shapes: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }],
            },
          ],
        },
      ]
    )

    const patched = patchNamedShapes(animation, ['Fond 1'], themedColorHex)

    const getColor = (node: unknown): number[] => {
      if (typeof node !== 'object' || node === null) return []
      const maybeColor = (node as Record<string, unknown>).c
      if (typeof maybeColor !== 'object' || maybeColor === null) return []
      const value = (maybeColor as Record<string, unknown>).k
      return Array.isArray(value) && value.every((v) => typeof v === 'number') ? value : []
    }

    const groupChild = getColor((patched.layers[0].shapes[0] as Record<string, unknown>).it?.[0])
    const nestedLayer = getColor(
      (patched.layers[0].shapes[0] as Record<string, unknown>).layers?.[0]?.shapes?.[0]
    )
    const assetShape = getColor(patched.assets?.[0].layers?.[0].shapes?.[0])

    ;[groupChild, nestedLayer, assetShape].forEach((color) => {
      expect(expectNumber(color[0])).toBeGreaterThan(0)
      expect(expectNumber(color[1])).toBeGreaterThan(0)
      expect(expectNumber(color[2])).toBeGreaterThan(0)
    })
  })

  it('should does not mutate the original animation', () => {
    const original = makeBaseAnimation([
      {
        shapes: [{ nm: 'Fond 1', c: { k: [0, 0, 0, 1] } }],
      },
    ])

    const patched = patchNamedShapes(original, ['Fond 1'], themedColorHex)

    expect(original.layers[0].shapes[0].c.k).toEqual([0, 0, 0, 1])
    expect((patched.layers[0].shapes[0].c as { k: number[] }).k[0]).not.toBe(0)
  })
})
