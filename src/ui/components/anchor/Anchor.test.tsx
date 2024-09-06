import React, { RefObject } from 'react'
import { ScrollView, View } from 'react-native'

import { renderHook } from 'tests/utils'
import { AnchorName } from 'ui/components/anchor/anchor-name'

import { AnchorProvider, useRegisterAnchor, useScrollToAnchor } from './AnchorContext'

describe('AnchorContext and Anchor Component', () => {
  const scrollViewRef = { current: { scrollTo: jest.fn() } } as unknown as RefObject<ScrollView>
  const handleCheckScrollY = jest.fn(() => 0)

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
      {children}
    </AnchorProvider>
  )

  it('should register an anchor', () => {
    const { result } = renderHook(() => useRegisterAnchor(), { wrapper })
    const ref = { current: null } as RefObject<View>
    result.current('venue-calendar' satisfies AnchorName, ref)

    expect(result.current).toBeInstanceOf(Function)
  })

  it('should scroll to the correct anchor', () => {
    const { result } = renderHook(() => useScrollToAnchor(), { wrapper })
    const ref = {
      current: {
        measure: jest.fn((_x, _y, _width, height, _pageX, pageY) => {
          result.current('venue-calendar' satisfies AnchorName)

          expect(scrollViewRef.current?.scrollTo).toHaveBeenCalledWith({
            y: pageY - height,
            animated: true,
          })
        }),
      },
    } as unknown as RefObject<View>

    const registerResult = renderHook(() => useRegisterAnchor(), { wrapper })
    registerResult.result.current('venue-calendar' satisfies AnchorName, ref)
  })
})
