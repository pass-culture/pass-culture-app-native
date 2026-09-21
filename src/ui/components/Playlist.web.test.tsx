import React from 'react'
import { Text } from 'react-native'

import { render, screen } from 'tests/utils/web'

import { Playlist } from './Playlist'

const data = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
]

describe('<Playlist />', () => {
  it('should render items as ul with li direct children on web', () => {
    render(
      <Playlist
        data={data}
        itemWidth={100}
        itemHeight={100}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
    )

    const list = screen.getByRole('list')
    const listItems = Array.from(list.children)

    expect(list.tagName).toBe('UL')
    expect(list).toHaveStyle({ flexDirection: 'row' })
    expect(listItems).toHaveLength(data.length)
    expect(listItems.every((child) => child.tagName === 'LI')).toBe(true)
  })
})
