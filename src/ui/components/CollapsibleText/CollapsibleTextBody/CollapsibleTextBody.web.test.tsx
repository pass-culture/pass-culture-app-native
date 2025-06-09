import React from 'react'

import { render, screen, waitFor } from 'tests/utils/web'

import { CollapsibleTextBody } from './CollapsibleTextBody'

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'

const mockOnTextLayout = jest.fn()

describe('CollapsibleTextContent', () => {
  let mockCallback: (
    entries: {
      target: HTMLElement
      contentRect: Partial<DOMRectReadOnly>
    }[]
  ) => void

  beforeAll(() => {
    const mockResizeObserver = jest.fn().mockImplementation((callback) => {
      mockCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    global.ResizeObserver = mockResizeObserver
  })

  const forceTextLayout = async () => {
    const text = await screen.findByText(TEXT)

    Object.defineProperties(text, {
      offsetHeight: { value: 80 },
      offsetWidth: { value: 100 },
    })

    if (!text) {
      return
    }

    mockCallback([
      {
        target: text,
        contentRect: { width: 100, height: 80, top: 0, left: 0 },
      },
    ])
  }

  it('should dispatch text layout event with lines data', async () => {
    render(<CollapsibleTextBody onTextLayout={mockOnTextLayout}>{[TEXT]}</CollapsibleTextBody>)

    await forceTextLayout()

    await waitFor(() =>
      expect(mockOnTextLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: { lines: expect.arrayContaining([{ height: expect.any(Number) }]) },
        })
      )
    )
  })
})
