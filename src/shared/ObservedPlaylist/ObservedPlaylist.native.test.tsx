import React from 'react'
import { FlatList, Text, View } from 'react-native'

import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('shared/analytics/logViewItem', () => ({
  logPlaylistDebug: jest.fn(),
}))

const onIntersectionChangeMock = jest.fn()
const onViewableItemsChangedMock = jest.fn()

describe('<ObservedPlaylist />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onIntersectionChange with true when element becomes visible', () => {
    render(
      <ObservedPlaylist
        onIntersectionChange={onIntersectionChangeMock}
        onViewableItemsChanged={onViewableItemsChangedMock}>
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

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    fireEvent(intersectionObserver, 'onChange', true)

    expect(onIntersectionChangeMock).toHaveBeenCalledWith(true)
  })

  it('should call onIntersectionChange with false when element is no longer visible', () => {
    render(
      <ObservedPlaylist
        onIntersectionChange={onIntersectionChangeMock}
        onViewableItemsChanged={onViewableItemsChangedMock}>
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

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    fireEvent(intersectionObserver, 'onChange', false)

    expect(onIntersectionChangeMock).toHaveBeenCalledWith(false)
  })

  it('should work without onIntersectionChange prop', () => {
    render(
      <ObservedPlaylist onViewableItemsChanged={onViewableItemsChangedMock}>
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

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    // Should not throw when onChange is called without onIntersectionChange prop
    expect(() => fireEvent(intersectionObserver, 'onChange', true)).not.toThrow()
  })

  it('should render children correctly', () => {
    render(
      <ObservedPlaylist
        onIntersectionChange={onIntersectionChangeMock}
        onViewableItemsChanged={onViewableItemsChangedMock}>
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

    expect(screen.getByText('Playlist content')).toBeOnTheScreen()
  })
})
