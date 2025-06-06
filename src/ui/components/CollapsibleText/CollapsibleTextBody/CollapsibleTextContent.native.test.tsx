import React from 'react'

import { act, fireEvent, render, screen } from 'tests/utils'

import { CollapsibleTextBody } from './CollapsibleTextBody'

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'
const NUMBER_OF_LINES = 5

const mockOnLayoutWithButton = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 2100,
    },
  },
}
const mockOnLayoutWithoutButton = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 150,
    },
  },
}
const mockOnTextLayoutWhenEllipsis = {
  nativeEvent: {
    lines: [{ width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 370 }],
  },
}
const mockOnTextLayoutWhenTooShort = {
  nativeEvent: {
    lines: [{ width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 300 }],
  },
}

const mockOnButtonPress = jest.fn()

// Mock needed for the file test to take into account CollapsibleTextContent.tsx rather than CollapsibleTextContent.ios.tsx
jest.mock('./CollapsibleTextContent', () => require('./CollapsibleTextContent.tsx'))

describe('CollapsibleTextContent', () => {
  it('should not display all text when text is not expanded', async () => {
    render(
      <CollapsibleTextBody
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        onButtonPress={mockOnButtonPress}>
        {[TEXT]}
      </CollapsibleTextBody>
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByText(TEXT).props.numberOfLines).toEqual(NUMBER_OF_LINES)
  })

  it('should display all text when text is expanded', async () => {
    render(
      <CollapsibleTextBody
        expanded
        numberOfLines={NUMBER_OF_LINES}
        onButtonPress={mockOnButtonPress}>
        {[TEXT]}
      </CollapsibleTextBody>
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByText(TEXT).props.numberOfLines).toBeUndefined()
  })

  it('should display Voir plus button when the text ends with an ellipsis (onLayout, then onTextLayout)', async () => {
    render(
      <CollapsibleTextBody
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        onButtonPress={mockOnButtonPress}>
        {[TEXT]}
      </CollapsibleTextBody>
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display Voir plus button when the last line is not filled', async () => {
    render(
      <CollapsibleTextBody
        expanded={false}
        numberOfLines={NUMBER_OF_LINES}
        onButtonPress={mockOnButtonPress}>
        {[TEXT]}
      </CollapsibleTextBody>
    )

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithoutButton)
      fireEvent(text, 'onTextLayout', mockOnTextLayoutWhenTooShort)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })
})
