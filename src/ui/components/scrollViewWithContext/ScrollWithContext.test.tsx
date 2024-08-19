import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { fireEvent, render, screen } from 'tests/utils'

import ScrollViewWithContext from './ScrollViewWithContext'

describe('ScrollViewWithContext', () => {
  it('should render children correctly', () => {
    render(
      <ScrollViewWithContext>
        <Text>Test Child 1</Text>
        <Text>Test Child 2</Text>
      </ScrollViewWithContext>
    )

    expect(screen.getByText('Test Child 1')).toBeTruthy()
    expect(screen.getByText('Test Child 2')).toBeTruthy()
  })

  it('should handle onScroll event', () => {
    const onScroll = jest.fn()
    render(
      <ScrollViewWithContext onScroll={onScroll}>
        <ViewWithHeight height={1000} testID="scrollViewContent" />
      </ScrollViewWithContext>
    )

    const EVENT = {
      nativeEvent: {
        contentOffset: { y: 100 },
      },
    }

    fireEvent.scroll(screen.getByTestId('scrollViewContent'), EVENT)

    expect(onScroll).toHaveBeenCalledWith(EVENT)
  })
})

const ViewWithHeight = styled.View<{ height: number }>(({ height }) => ({
  height,
  width: 100,
}))
