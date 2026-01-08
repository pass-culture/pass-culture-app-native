import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { Typo } from 'ui/theme'

import { CollapsibleText } from './CollapsibleText'

const LONG_TEXT = 'LONG Lorem ipsum dolor sit amet.'.repeat(30)
const SHORT_TEXT = 'SHORT Lorem ipsum dolor sit amet.'

const user = userEvent.setup()

jest.mock('libs/firebase/analytics/analytics')

describe('CollapsibleText', () => {
  it('should display truncated text when not expanded', () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    expect(screen.queryByText(LONG_TEXT)).not.toBeOnTheScreen()
    expect(screen.getByText(/…$/)).toBeOnTheScreen()
  })

  it('should display "Voir plus" button when text is truncated', () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display "Voir plus" button when text is short', () => {
    render(<CollapsibleText text={SHORT_TEXT} maxChars={100} />)

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should not display "Voir moins" button when text is short', () => {
    render(<CollapsibleText text={SHORT_TEXT} maxChars={100} />)

    expect(screen.queryByText('Voir moins')).not.toBeOnTheScreen()
  })

  it('should display full text when clicking on "Voir plus"', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    const button = screen.getByText('Voir plus')
    await user.press(button)

    expect(screen.getByText(LONG_TEXT)).toBeOnTheScreen()
    expect(screen.getByText('Voir moins')).toBeOnTheScreen()
  })

  it('should collapse text again when clicking on "Voir moins"', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))
    await user.press(screen.getByText('Voir moins'))

    expect(screen.queryByText(LONG_TEXT)).not.toBeOnTheScreen()
    expect(screen.getByText(/…$/)).toBeOnTheScreen()
  })

  it('should not display additional children when not expanded', () => {
    render(
      <CollapsibleText text={LONG_TEXT} maxChars={100}>
        <Typo.BodyAccentXs>
          Additional content displayed when the text is expanded.
        </Typo.BodyAccentXs>
      </CollapsibleText>
    )

    expect(
      screen.queryByText('Additional content displayed when the text is expanded.')
    ).not.toBeOnTheScreen()
  })

  it('should display additional children when expanded', async () => {
    render(
      <CollapsibleText text={LONG_TEXT} maxChars={100}>
        <Typo.BodyAccentXs>
          Additional content displayed when the text is expanded.
        </Typo.BodyAccentXs>
      </CollapsibleText>
    )

    await user.press(screen.getByText('Voir plus'))

    expect(
      screen.getByText('Additional content displayed when the text is expanded.')
    ).toBeOnTheScreen()
  })
})
