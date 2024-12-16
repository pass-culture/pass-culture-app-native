import React from 'react'

import { act, render, screen, userEvent } from 'tests/utils'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'

const mockOnLayoutWithButton = {
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

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'
const NUMBER_OF_LINES = 5

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<CollapsibleText />', () => {
  it('should not display all text', () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    expect(screen.getByText(TEXT).props.numberOfLines).toEqual(5)
  })

  it('should display Voir plus button when the text ends with an ellipsis (onLayout, then onTextLayout)', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should display Voir plus button when the text ends with an ellipsis (onTextLayout, then onLayout)', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
      text.props.onLayout(mockOnLayoutWithButton)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display Voir plus button when the last line is not filled', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenTooShort)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should use Étendre le texte in button accessibility label', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
    })

    expect(screen.getByLabelText('Étendre le texte')).toBeOnTheScreen()
  })

  it('should display Voir moins on button text when pressing it', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByText('Voir moins')).toBeOnTheScreen()
  })

  it('should display all text when pressing button', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByText(TEXT).props.numberOfLines).toBeUndefined()
  })

  it('should use Réduire le texte in button accessibility label when pressing button', async () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    const text = screen.getByText(TEXT)
    await act(async () => {
      text.props.onLayout(mockOnLayoutWithButton)
      text.props.onTextLayout(mockOnTextLayoutWhenEllipsis)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByLabelText('Réduire le texte')).toBeOnTheScreen()
  })

  it('should use styled typo when text is markdown', () => {
    render(
      <CollapsibleText numberOfLines={NUMBER_OF_LINES} isMarkdown>
        {TEXT}
      </CollapsibleText>
    )

    expect(screen.getByTestId('styledTypo')).toBeOnTheScreen()
  })

  it('should not use styled typo when text is not markdown', () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    expect(screen.queryByTestId('styledTypo')).not.toBeOnTheScreen()
  })
})
