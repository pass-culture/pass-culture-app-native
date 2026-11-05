import React from 'react'
import { FlatList, Text, View, ViewToken } from 'react-native'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { act, render, screen } from 'tests/utils'

let mockFocusEffect: (() => void) | undefined
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('__mocks__/@react-navigation/native'),
  useFocusEffect: (effect: () => void) => {
    mockFocusEffect = effect
  },
}))

const onIntersectionChangeMock = jest.fn()
const onItemViewedMock = jest.fn()

let observerCallback: IntersectionObserverCallback | undefined
let isTargetVisible = false
let viewableItemsChangedHandler:
  ((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void) | undefined

const intersectionEntry = (isIntersecting: boolean) =>
  ({
    isIntersecting,
    boundingClientRect: { height: 100 },
    intersectionRect: { height: 100 },
  }) as IntersectionObserverEntry

const installIntersectionObserver = () => {
  observerCallback = undefined
  isTargetVisible = false
  globalThis.IntersectionObserver = class {
    private readonly callback: IntersectionObserverCallback
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
      observerCallback = callback
    }
    observe() {
      this.callback([intersectionEntry(isTargetVisible)], this as unknown as IntersectionObserver)
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
  isTargetVisible = isIntersecting
  act(() => {
    observerCallback?.([intersectionEntry(isIntersecting)], {} as IntersectionObserver)
  })
}

const viewToken = (index: number, isViewable = true): ViewToken => ({
  key: `offer-${index}`,
  index,
  item: { objectID: `offer-${index}` },
  isViewable,
})

const emitViewableItems = (viewableItems: ViewToken[], changed = viewableItems) => {
  act(() => {
    viewableItemsChangedHandler?.({ viewableItems, changed })
  })
}

const playlist = (onIntersectionChange?: (inView: boolean) => void) => (
  <ObservedPlaylist onIntersectionChange={onIntersectionChange} onItemViewed={onItemViewedMock}>
    {({ listRef, handleViewableItemsChanged }) => {
      viewableItemsChangedHandler = handleViewableItemsChanged
      return (
        <View>
          <FlatList
            ref={listRef}
            data={[]}
            renderItem={() => null}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
          <Text>Playlist content</Text>
        </View>
      )
    }}
  </ObservedPlaylist>
)

const renderPlaylist = (onIntersectionChange?: (inView: boolean) => void) =>
  render(playlist(onIntersectionChange))

describe('<ObservedPlaylist />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    installIntersectionObserver()
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_INTERSECTION_OBSERVER])
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

  it('should log only the viewable items when the playlist is in view', () => {
    renderPlaylist()
    emitIntersection(true)

    emitViewableItems([viewToken(0)], [viewToken(0), viewToken(1, false)])

    expect(onItemViewedMock.mock.calls).toEqual([
      [{ key: 'offer-0', index: 0, item: { objectID: 'offer-0' } }],
    ])
  })

  it('should log the visible items only when the playlist comes into view', () => {
    renderPlaylist()
    emitViewableItems([viewToken(0), viewToken(1)])

    expect(onItemViewedMock).not.toHaveBeenCalled()

    emitIntersection(true)

    expect(onItemViewedMock).toHaveBeenCalledTimes(2)
  })

  it('should log the visible items once when the screen is focused again', () => {
    const { rerender } = render(playlist(jest.fn()))
    emitIntersection(true)
    emitViewableItems([viewToken(0), viewToken(1)])
    onItemViewedMock.mockClear()

    rerender(playlist(jest.fn()))
    act(() => mockFocusEffect?.())

    expect(onItemViewedMock).toHaveBeenCalledTimes(2)
  })
})
