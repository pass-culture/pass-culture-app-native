import { getAccessibleZonesLayout } from 'ui/components/CollapsibleText/helpers/getAccessibleZonesLayout'

const LINES = [
  { text: 'abc ', y: 0, height: 20 },
  { text: 'def ', y: 20, height: 20 },
  { text: 'ghi', y: 40, height: 20 },
]

describe('getAccessibleZonesLayout', () => {
  it('should overlap both zones on the line where the text is cut', () => {
    expect(getAccessibleZonesLayout(LINES, 6)).toEqual({
      firstZone: { top: 0, height: 40 },
      secondZone: { top: 20, height: 40 },
    })
  })

  it('should start the second zone on the next line when the text is cut at a line end', () => {
    expect(getAccessibleZonesLayout(LINES, 4)).toEqual({
      firstZone: { top: 0, height: 20 },
      secondZone: { top: 20, height: 40 },
    })
  })

  it('should place the second zone on the last line when the first part is longer than the rendered text', () => {
    expect(getAccessibleZonesLayout(LINES, 50)).toEqual({
      firstZone: { top: 0, height: 60 },
      secondZone: { top: 40, height: 20 },
    })
  })

  it('should return undefined when there is no line', () => {
    expect(getAccessibleZonesLayout([], 6)).toBeUndefined()
  })
})
