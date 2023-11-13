/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { createRef, CSSProperties, RefObject } from 'react'
import { View } from 'react-native'

import { act, render, screen } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { OptimizedList } from './OptimizedList.web'
import { OnLayoutProps, OptimizedListProps, OptimizedListRef, RenderItemProps } from './types'
import { generateItems } from './utils'

function renderOptimizedList<T, AD>(
  props?: Partial<OptimizedListProps<T, AD>>,
  ref?: RefObject<OptimizedListRef>
) {
  const defaultItems = generateItems(100)

  return render(
    <OptimizedList
      itemSize={100}
      items={defaultItems as T[]}
      height={500}
      renderItem={({ index, data, style }: RenderItemProps<T, AD>) => {
        const item = data.items[index] as typeof defaultItems[number]

        return (
          <span key={item.name} style={style as CSSProperties}>
            {item.name}
          </span>
        )
      }}
      {...props}
      ref={ref}
    />
  )
}

function HeaderComponent(props: OnLayoutProps) {
  return (
    <View {...props}>
      <Typo.Body>Hello Header</Typo.Body>
    </View>
  )
}

function FooterComponent(props: OnLayoutProps) {
  return (
    <View {...props}>
      <Typo.Body>Hello Footer</Typo.Body>
    </View>
  )
}

describe('OptimizedList', () => {
  it('should render all items on a very very high screen (hopefully will not happen)', () => {
    renderOptimizedList({ height: 10000 })

    expect(screen.getAllByText(/Item /)).toHaveLength(100)
  })

  it('should render only a few items on a small screen', () => {
    renderOptimizedList()

    expect(screen.getAllByText(/Item /)).toHaveLength(7)
  })

  it('should display the header', () => {
    renderOptimizedList({
      headerComponent: HeaderComponent,
    })

    expect(screen.getByText(/Hello Header/)).toBeTruthy()
  })

  it('should not render the footer since it is below all items', () => {
    renderOptimizedList({
      footerComponent: FooterComponent,
    })

    expect(() => screen.getByText(/Hello Footer/)).toThrow()
  })

  it('should render the footer when scrolled to very bottom', async () => {
    const ref = createRef<OptimizedListRef>()

    renderOptimizedList(
      {
        footerComponent: FooterComponent,
      },
      ref
    )

    await act(async () => {})
    act(() => {
      ref.current!.scrollToItem(100)
    })

    expect(screen.getByText(/Hello Footer/)).toBeTruthy()
  })

  it('should trigger `onEndReached` when scrolled to bottom', async () => {
    const ref = createRef<OptimizedListRef>()
    const onEndReached = jest.fn()

    renderOptimizedList(
      {
        footerComponent: FooterComponent,
        onEndReached,
      },
      ref
    )

    await act(async () => {})
    act(() => {
      ref.current!.scrollToItem(100)
    })

    expect(onEndReached).toHaveBeenCalledWith()
  })

  it('should trigger `onScroll` when scrolling', async () => {
    const ref = createRef<OptimizedListRef>()
    const onScroll = jest.fn()

    renderOptimizedList(
      {
        footerComponent: FooterComponent,
        onScroll,
      },
      ref
    )

    await act(async () => {})
    act(() => {
      ref.current!.scrollToItem(20)
    })

    expect(onScroll).toHaveBeenCalledWith(1600)
  })
})
