import { padding } from './padding'
import { getSpacing } from './spacing'

describe('padding', () => {
  it('only top should return all four sides the same', () => {
    const actualPaddingProps = padding(1)
    const expectedPaddingProps = {
      paddingTop: getSpacing(1),
      paddingRight: getSpacing(1),
      paddingBottom: getSpacing(1),
      paddingLeft: getSpacing(1),
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top and right should define vertical and horizontal', () => {
    const actualPaddingProps = padding(1, 2)
    const expectedPaddingProps = {
      paddingTop: getSpacing(1),
      paddingRight: getSpacing(2),
      paddingBottom: getSpacing(1),
      paddingLeft: getSpacing(2),
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top, right and bottom should define top, horizontal and bottom', () => {
    const actualPaddingProps = padding(1, 2, 3)
    const expectedPaddingProps = {
      paddingTop: getSpacing(1),
      paddingRight: getSpacing(2),
      paddingBottom: getSpacing(3),
      paddingLeft: getSpacing(2),
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('top, right bottom and left should define all sides', () => {
    const actualPaddingProps = padding(1, 2, 3, 4)
    const expectedPaddingProps = {
      paddingTop: getSpacing(1),
      paddingRight: getSpacing(2),
      paddingBottom: getSpacing(3),
      paddingLeft: getSpacing(4),
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })
})
