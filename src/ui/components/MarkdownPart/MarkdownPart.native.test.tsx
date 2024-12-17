import React from 'react'

import { render, screen } from 'tests/utils'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('MarkdownPart', () => {
  it('should return text in normal style by default', () => {
    render(<MarkdownPart text="text" />)

    expect(screen.getByTestId('styledBody')).toHaveStyle({ textDecorationLine: 'none' })
    expect(screen.getByTestId('styledBody')).toBeOnTheScreen()
  })

  it('should return underline text when part is underline', () => {
    render(<MarkdownPart text="text" isUnderline />)

    expect(screen.getByTestId('styledBody')).toHaveStyle({ textDecorationLine: 'underline' })
  })

  it('should return text in bold style when part is bold and not italic', () => {
    render(<MarkdownPart text="text" isBold />)

    expect(screen.getByTestId('styledBodyAccent')).toHaveStyle({ textDecorationLine: 'none' })
    expect(screen.getByTestId('styledBodyAccent')).toBeOnTheScreen()
  })

  it('should return underline text in bold style when part is bold, not italic and underline', () => {
    render(<MarkdownPart text="text" isBold isUnderline />)

    expect(screen.getByTestId('styledBodyAccent')).toHaveStyle({ textDecorationLine: 'underline' })
  })

  it('should return text in italic style when part is italic and not bold', () => {
    render(<MarkdownPart text="text" isItalic />)

    expect(screen.getByTestId('styledBodyItalic')).toHaveStyle({ textDecorationLine: 'none' })
    expect(screen.getByTestId('styledBodyItalic')).toBeOnTheScreen()
  })

  it('should return underline text in italic style when part is italic, not bold and underline', () => {
    render(<MarkdownPart text="text" isItalic isUnderline />)

    expect(screen.getByTestId('styledBodyItalic')).toHaveStyle({ textDecorationLine: 'underline' })
  })

  it('should return text in italic and bold styles when part is italic and bold', () => {
    render(<MarkdownPart text="text" isItalic isBold />)

    expect(screen.getByTestId('styledBodyItalicAccent')).toHaveStyle({ textDecorationLine: 'none' })
    expect(screen.getByTestId('styledBodyItalicAccent')).toBeOnTheScreen()
  })

  it('should return underline text in italic and bold styles when part is italic, bold and underline', () => {
    render(<MarkdownPart text="text" isItalic isBold isUnderline />)

    expect(screen.getByTestId('styledBodyItalicAccent')).toHaveStyle({
      textDecorationLine: 'underline',
    })
  })
})
