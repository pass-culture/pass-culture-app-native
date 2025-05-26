import { FILTERS_MODAL_NAV_OPTIONS } from './filtersModalNavOptions'

const createAnimatedInterpolationMock = (value: number) => ({
  interpolate: jest.fn().mockImplementation(() => value),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
  hasListeners: jest.fn(),
})

describe('filtersModalNavOptions', () => {
  it('should return screen options', () => {
    const { cardStyleInterpolator } = FILTERS_MODAL_NAV_OPTIONS

    expect(FILTERS_MODAL_NAV_OPTIONS).toBeDefined()
    expect(
      cardStyleInterpolator?.({
        index: 0,
        closing: createAnimatedInterpolationMock(1),
        inverted: createAnimatedInterpolationMock(1),
        insets: { top: 0, left: 0, bottom: 0, right: 0 },
        swiping: createAnimatedInterpolationMock(0),
        current: { progress: createAnimatedInterpolationMock(1) },
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
