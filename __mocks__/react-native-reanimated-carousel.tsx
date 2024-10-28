import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { TCarouselProps } from 'react-native-reanimated-carousel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default forwardRef<
  any,
  Omit<TCarouselProps, 'onProgressChange'> & {
    onProgressChange: (offsetProgress: number, absoluteProgress: number) => void
  }
>(function Carousel(
  { renderItem, data, testID, width, height, onProgressChange, defaultIndex = 0 },
  ref
) {
  useImperativeHandle(ref, () => ({
    next: jest.fn(),
    prev: jest.fn(),
    scrollTo: ({ index }: { index: number }) => {
      onProgressChange(0, index)
    },
    getCurrentIndex: jest.fn(),
  }))

  useEffect(() => {
    if (defaultIndex > 0) {
      onProgressChange(0, defaultIndex)
    }
  }, [defaultIndex, onProgressChange])

  return (
    <FlatList
      ref={ref}
      testID={testID}
      renderItem={renderItem as unknown as ListRenderItem<unknown>}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      style={{ width, height }}
    />
  )
})
