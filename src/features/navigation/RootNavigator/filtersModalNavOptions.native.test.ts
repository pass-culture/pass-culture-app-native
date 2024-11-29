import { FILTERS_MODAL_NAV_OPTIONS } from './filtersModalNavOptions'

describe('filtersModalNavOptions', () => {
  it('should return screen options', () => {
    const { cardStyleInterpolator } = FILTERS_MODAL_NAV_OPTIONS

    expect(FILTERS_MODAL_NAV_OPTIONS).toBeDefined()
    expect(
      cardStyleInterpolator?.({
        index: 0,
        closing: {},
        inverted: 1,
        insets: { top: 0, left: 0, bottom: 0, right: 0 },
        swiping: false,
        current: { progress: { interpolate: jest.fn().mockImplementation(() => 1) } },
        layouts: { screen: { height: 300, width: 300 } },
      })
    ).toMatchObject({
      overlayStyle: {
        backgroundColor: 'black',
        opacity: 1,
      },
      cardStyle: {
        transform: [
          {
            translateY: 1,
          },
        ],
      },
    })
  })
})
