import React from 'react'

import { render, screen } from 'tests/utils'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('MarkdownPart', () => {
  it('should return text in normal style by default', () => {
    render(<MarkdownPart text="text" />)

    expect(screen.getByTestId('styledBody')).toBeOnTheScreen()
  })

  it('should return text in bold style when part is bold and not italic', () => {
    render(<MarkdownPart text="text" isBold />)

    expect(screen.getByTestId('styledBodyAccent')).toBeOnTheScreen()
  })

  it('should return text in italic style when part is italic and not bold', () => {
    render(<MarkdownPart text="text" isItalic />)

    expect(screen.getByTestId('styledBodyItalic')).toBeOnTheScreen()
  })

  it('should return text in italic and bold styles when part is italic and bold', () => {
    render(<MarkdownPart text="text" isItalic isBold />)

    expect(screen.getByTestId('styledBodyItalicAccent')).toBeOnTheScreen()
  })
})
