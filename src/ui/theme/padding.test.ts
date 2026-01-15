import { theme } from 'theme'

import { padding } from './padding'
;-describe('padding', () => {
  it('only top should return all four sides the same', () => {
    const actualPaddingProps = padding(1)
    const expectedPaddingProps = {
      paddingTop: theme.designSystem.size.spacing.xs,
      paddingRight: theme.designSystem.size.spacing.xs,
      paddingBottom: theme.designSystem.size.spacing.xs,
      paddingLeft: theme.designSystem.size.spacing.xs,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top and right should define vertical and horizontal', () => {
    const actualPaddingProps = padding(1, 2)
    const expectedPaddingProps = {
      paddingTop: theme.designSystem.size.spacing.xs,
      paddingRight: theme.designSystem.size.spacing.s,
      paddingBottom: theme.designSystem.size.spacing.xs,
      paddingLeft: theme.designSystem.size.spacing.s,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('only top, right and bottom should define top, horizontal and bottom', () => {
    const actualPaddingProps = padding(1, 2, 3)
    const expectedPaddingProps = {
      paddingTop: theme.designSystem.size.spacing.xs,
      paddingRight: theme.designSystem.size.spacing.s,
      paddingBottom: theme.designSystem.size.spacing.m,
      paddingLeft: theme.designSystem.size.spacing.s,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })

  it('top, right bottom and left should define all sides', () => {
    const actualPaddingProps = padding(1, 2, 3, 4)
    const expectedPaddingProps = {
      paddingTop: theme.designSystem.size.spacing.xs,
      paddingRight: theme.designSystem.size.spacing.s,
      paddingBottom: theme.designSystem.size.spacing.m,
      paddingLeft: theme.designSystem.size.spacing.l,
    }

    expect(expectedPaddingProps).toEqual(actualPaddingProps)
  })
})
