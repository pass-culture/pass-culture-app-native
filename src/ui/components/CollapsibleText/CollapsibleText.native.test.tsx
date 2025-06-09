import React from 'react'

import { act, fireEvent, render, screen, userEvent } from 'tests/utils'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'
const NUMBER_OF_LINES = 5

const mockOnLayoutWithButton = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 150,
    },
  },
}
const mockOnLayoutWithoutButton = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 128,
    },
  },
}

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<CollapsibleText />', () => {
  it('should render collapsible text', () => {
    render(<CollapsibleText collapsedLineCount={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    expect(screen.getByText(TEXT)).toBeOnTheScreen()
  })

  it('should not display all text when text is not expanded', async () => {
    render(<CollapsibleText collapsedLineCount={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
    })

    expect(screen.getByText(TEXT).props.numberOfLines).toEqual(NUMBER_OF_LINES)
  })

  it('should display all text when text is expanded', async () => {
    render(<CollapsibleText collapsedLineCount={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByText(TEXT).props.numberOfLines).toBeUndefined()
  })

  it('should not display Voir plus button when the last line is not filled', async () => {
    render(<CollapsibleText collapsedLineCount={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithoutButton)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should display Voir plus button when the text ends with an ellipsis', async () => {
    render(<CollapsibleText collapsedLineCount={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      fireEvent(text, 'onLayout', mockOnLayoutWithButton)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })
})
