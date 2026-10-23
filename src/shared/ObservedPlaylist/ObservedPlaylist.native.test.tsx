import React from 'react'
import { FlatList, Text, View } from 'react-native'

import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { act, render, screen } from 'tests/utils'

const onIntersectionChangeMock = jest.fn()
const onItemViewedMock = jest.fn()

let observerCallback: IntersectionObserverCallback | undefined

const installIntersectionObserver = () => {
  observerCallback = undefined
  globalThis.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) {
      observerCallback = callback
    }
    observe() {
      return undefined
    }
    unobserve() {
      return undefined
    }
    disconnect() {
      return undefined
    }
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
}

const emitIntersection = (isIntersecting: boolean) => {
  act(() => {
    jest.advanceTimersByTime(300)
  })
  act(() => {
    observerCallback?.(
      [
        {
          isIntersecting,
          boundingClientRect: { height: 100 },
          intersectionRect: { height: 100 },
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )
  })
}

const renderPlaylist = (onIntersectionChange?: (inView: boolean) => void) =>
  render(
    <ObservedPlaylist onIntersectionChange={onIntersectionChange} onItemViewed={onItemViewedMock}>
      {({ listRef, handleViewableItemsChanged }) => (
        <View>
          <FlatList
            ref={listRef}
            data={[]}
            renderItem={() => null}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
          <Text>Playlist content</Text>
        </View>
      )}
    </ObservedPlaylist>
  )

describe('<ObservedPlaylist />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    installIntersectionObserver()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should call onIntersectionChange with true when element becomes visible', () => {
    renderPlaylist(onIntersectionChangeMock)

    emitIntersection(true)

    expect(onIntersectionChangeMock).toHaveBeenCalledWith(true)
  })

  it('should call onIntersectionChange with false when element is no longer visible', () => {
    renderPlaylist(onIntersectionChangeMock)

    emitIntersection(false)

    expect(onIntersectionChangeMock).toHaveBeenCalledWith(false)
  })

  it('should work without onIntersectionChange prop', () => {
    renderPlaylist()

    expect(() => emitIntersection(true)).not.toThrow()
  })

  it('should render children correctly', () => {
    renderPlaylist(onIntersectionChangeMock)

    expect(screen.getByText('Playlist content')).toBeOnTheScreen()
  })
})
