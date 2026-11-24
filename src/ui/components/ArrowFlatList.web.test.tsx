import React from 'react'
import { Text } from 'react-native'

import { render, screen, userEvent } from 'tests/utils/web'
import { ArrowFlatList } from 'ui/components/ArrowFlatList'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'

jest.mock('ui/hooks/useHorizontalFlatListScroll', () => ({
  useHorizontalFlatListScroll: jest.fn(),
}))

const mockedUseHorizontalFlatListScroll = jest.mocked(useHorizontalFlatListScroll)
const user = userEvent.setup()

const handleScrollPrevious = jest.fn()
const handleScrollNext = jest.fn()
const onScroll = jest.fn()
const onContentSizeChange = jest.fn()

const setScrollState = ({ isStart = true, isEnd = false }) => {
  mockedUseHorizontalFlatListScroll.mockReturnValue({
    isStart,
    isEnd,
    handleScrollPrevious,
    handleScrollNext,
    onScroll,
    onContentSizeChange,
    onContainerLayout: jest.fn(),
  })
}

const renderList = (props = {}) =>
  render(
    <ArrowFlatList
      testID="arrow-flat-list"
      data={[{ id: '1', title: 'Item 1' }]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      {...props}
    />
  )

describe('<ArrowFlatList />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseHorizontalFlatListScroll.mockReturnValue({
      isStart: true,
      isEnd: false,
      handleScrollPrevious,
      handleScrollNext,
      onScroll,
      onContentSizeChange,
      onContainerLayout: jest.fn(),
    })
  })

  it('should scroll right when the right arrow is pressed at the start', async () => {
    renderList()

    expect(screen.queryByTestId('flat-list-left-arrow')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Faire défiler la liste vers la droite'))

    expect(handleScrollNext).toHaveBeenCalledTimes(1)
  })

  it('should scroll left when the left arrow is pressed at the end', async () => {
    setScrollState({ isStart: false, isEnd: true })
    renderList()

    expect(screen.queryByTestId('flat-list-right-arrow')).not.toBeOnTheScreen()

    await user.click(screen.getByLabelText('Faire défiler la liste vers la gauche'))

    expect(handleScrollPrevious).toHaveBeenCalledTimes(1)
  })

  it('should hide the left arrow when there is no item to the left', () => {
    setScrollState({ isStart: true, isEnd: false })

    renderList()

    expect(screen.queryByTestId('flat-list-left-arrow')).not.toBeOnTheScreen()
  })

  it('should hide the right arrow when there is no item to the right', () => {
    setScrollState({ isStart: false, isEnd: true })

    renderList()

    expect(screen.queryByTestId('flat-list-right-arrow')).not.toBeOnTheScreen()
  })

  it('should display both arrows when items are available on the left and right', () => {
    setScrollState({ isStart: false, isEnd: false })

    renderList()

    expect(screen.getByTestId('flat-list-left-arrow')).toBeInTheDocument()
    expect(screen.getByTestId('flat-list-right-arrow')).toBeInTheDocument()
  })
})
