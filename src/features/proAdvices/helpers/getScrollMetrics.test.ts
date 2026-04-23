import { getScrollMetrics } from 'features/proAdvices/helpers/getScrollMetrics'

describe('getScrollMetrics', () => {
  it('should return native scroll metrics when native event metrics are available', () => {
    const event = {
      nativeEvent: {
        contentOffset: { y: 120 },
        contentSize: { height: 800 },
        layoutMeasurement: { height: 400 },
      },
    }

    expect(getScrollMetrics(event)).toEqual({
      contentHeight: 800,
      offsetY: 120,
      viewportHeight: 400,
    })
  })

  it('should return web scroll metrics from target when native event metrics are unavailable', () => {
    const event = {
      nativeEvent: {
        contentOffset: undefined,
        contentSize: undefined,
        layoutMeasurement: undefined,
        target: {
          clientHeight: 400,
          scrollHeight: 800,
          scrollTop: 120,
        },
      },
    }

    expect(getScrollMetrics(event)).toEqual({
      contentHeight: 800,
      offsetY: 120,
      viewportHeight: 400,
    })
  })

  it('should return null when neither native nor web scroll metrics are available', () => {
    const event = {
      nativeEvent: {
        contentOffset: undefined,
        contentSize: undefined,
        layoutMeasurement: undefined,
        target: {},
      },
    }

    expect(getScrollMetrics(event)).toBeNull()
  })
})
