import { padding } from './padding'

describe('padding', () => {
  it('only top should return all four sides the same', () => {
    const actualPaddingProps = padding(1)
    const expectedPaddingProps = {
      paddingTop: 4,
      paddingRight: 4,
      paddingBottom: 4,
      paddingLeft: 4,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top and right should define vertical and horizontal', () => {
    const actualPaddingProps = padding(1, 2)
    const expectedPaddingProps = {
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: 4,
      paddingLeft: 8,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top, right and bottom should define top, horizontal and bottom', () => {
    const actualPaddingProps = padding(1, 2, 3)
    const expectedPaddingProps = {
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: 12,
      paddingLeft: 8,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('top, right bottom and left should define all sides', () => {
    const actualPaddingProps = padding(1, 2, 3, 4)
    const expectedPaddingProps = {
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: 12,
      paddingLeft: 16,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })
})
