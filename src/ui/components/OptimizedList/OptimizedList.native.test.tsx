import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'
import { Li } from 'ui/components/Li'
import { OptimizedListProps, RenderItemProps } from 'ui/components/OptimizedList/types'
import { Typo } from 'ui/theme'

import { OptimizedList } from './OptimizedList'
import { generateItems } from './utils'

function renderOptimizedList<T, AD>(props?: Partial<OptimizedListProps<T, AD>>) {
  const defaultItems = generateItems(100)

  return render(
    <OptimizedList
      itemSize={100}
      items={defaultItems as T[]}
      height={500}
      renderItem={({ index, data }: RenderItemProps<T, AD>) => {
        const item = data.items[index] as typeof defaultItems[number]

        return (
          <Li key={item.name}>
            <Typo.Body>{item.name}</Typo.Body>
          </Li>
        )
      }}
      {...props}
    />
  )
}

describe('OptimizedList', () => {
  it('should render header', () => {
    renderOptimizedList({ headerComponent: () => <View testID="header" /> })

    expect(screen.getByTestId('header')).toBeOnTheScreen()
  })

  it('should render footer', () => {
    renderOptimizedList({ footerComponent: () => <View testID="footer" /> })

    expect(screen.getByTestId('footer')).toBeOnTheScreen()
  })
})
