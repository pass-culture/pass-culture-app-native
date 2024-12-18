import React from 'react'

import { act, fireEvent, render, screen, userEvent } from 'tests/utils'
import { CollapsibleTextContent } from 'ui/components/CollapsibleText/CollapsibleTextContent/CollapsibleTextContent.ios'

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'
const NUMBER_OF_LINES = 5

const mockOnTextLayoutWhenEllipsis = {
  nativeEvent: {
    lines: [
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
    ],
  },
}
const mockOnTextLayoutWithoutEllipsis = {
  nativeEvent: {
    lines: [
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
      { width: 100, height: 25.6 },
    ],
  },
}

const mockRenderContent = () => [TEXT]

const user = userEvent.setup()

jest.useFakeTimers()

describe('CollapsibleTextContent iOS', () => {
  it('should display Voir plus button when the text ends with an ellipsis', async () => {
    render(
      <CollapsibleTextContent
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={jest.fn()}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display Voir plus button when the text fits within the default height', async () => {
    render(
      <CollapsibleTextContent
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={jest.fn()}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWithoutEllipsis)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should set number of lines when text not expanded', async () => {
    render(
      <CollapsibleTextContent
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={jest.fn()}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWithoutEllipsis)
    })

    expect(screen.getByText(TEXT).props.numberOfLines).toEqual(5)
  })

  it('should not set number of lines when text expanded', async () => {
    render(
      <CollapsibleTextContent
        expanded
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={jest.fn()}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWithoutEllipsis)
    })

    expect(screen.getByText(TEXT).props.numberOfLines).toEqual(undefined)
  })

  it('should trigger button press when the button is pressed', async () => {
    const mockOnButtonPress = jest.fn()
    render(
      <CollapsibleTextContent
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={mockOnButtonPress}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(mockOnButtonPress).toHaveBeenCalledTimes(1)
  })

  it('should not recalculate max height text when it is already set', async () => {
    render(
      <CollapsibleTextContent
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        renderContent={mockRenderContent}
        onButtonPress={jest.fn()}
      />
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWithoutEllipsis)
    })

    await act(async () => {
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })
})
