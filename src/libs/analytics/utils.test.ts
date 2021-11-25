import { NativeScrollEvent } from 'react-native'

import { isCloseToBottom } from './utils'

describe('[Analytics utils]', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }
  it('event should not be close to bottom', () => {
    expect(isCloseToBottom(nativeEventMiddle as unknown as NativeScrollEvent)).toBeFalsy()
  })
  it('event should be close to bottom', () => {
    expect(isCloseToBottom(nativeEventBottom as unknown as NativeScrollEvent)).toBeTruthy()
  })
})
