import React from 'react'

import { act, fireEvent, render, screen } from 'tests/utils/web'

import { CollapsibleText } from './CollapsibleText'

const LONG_TEXT = 'LONG Lorem ipsum dolor sit amet.'.repeat(30)
const CUT_INDEX = LONG_TEXT.slice(0, 100).lastIndexOf(' ')
const CONTINUATION = LONG_TEXT.slice(CUT_INDEX)

jest.mock('libs/firebase/analytics/analytics')

describe('<CollapsibleText />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const expandText = async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    fireEvent.click(screen.getByText('Voir plus'))
    await act(async () => {
      jest.advanceTimersByTime(150)
    })
  }

  it('should move focus to the continuation of the text when expanded', async () => {
    await expandText()

    const focusedElement = document.activeElement as HTMLElement

    expect(focusedElement.tagName).toBe('SPAN')
    expect(focusedElement.getAttribute('tabindex')).toBe('-1')
    expect(focusedElement.textContent).toBe(CONTINUATION)
  })

  it('should render the continuation inline in the same text block when expanded', async () => {
    await expandText()

    const focusedElement = document.activeElement as HTMLElement

    expect(focusedElement.parentElement?.tagName).toBe('DIV')
    expect(focusedElement.parentElement?.textContent).toBe(LONG_TEXT)
  })
})
