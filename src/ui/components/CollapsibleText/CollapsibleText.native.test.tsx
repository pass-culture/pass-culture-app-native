import React from 'react'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { focusElement } from 'shared/accessibility/helpers/focusElement'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { Typo } from 'ui/theme'

import { CollapsibleText } from './CollapsibleText'

const LONG_TEXT = 'LONG Lorem ipsum dolor sit amet.'.repeat(30)
const SHORT_TEXT = 'SHORT Lorem ipsum dolor sit amet.'
const CUT_INDEX = LONG_TEXT.slice(0, 100).lastIndexOf(' ')
const FIRST_PART_LABEL = LONG_TEXT.slice(0, CUT_INDEX).trim()
const CONTINUATION_LABEL = LONG_TEXT.slice(CUT_INDEX).trim()

const TEXT_WITH_LINK = `${'Lorem ipsum. '.repeat(10)}Plus d’infos sur www.example.com pour la **suite**.`

const TEXT_WITH_LINK_IN_FIRST_PART = `Voir www.example.com pour ${'Lorem ipsum. '.repeat(10).trim()}`
const LINK_CUT_INDEX = TEXT_WITH_LINK_IN_FIRST_PART.slice(0, 100).lastIndexOf(' ')
const RENDERED_TEXT_WITH_LINK = TEXT_WITH_LINK_IN_FIRST_PART.replace('www.', 'http://www.')
const RENDERED_LINK_CUT_INDEX = LINK_CUT_INDEX + 'http://'.length

const LINE_HEIGHT = 20

const user = userEvent.setup()

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('shared/accessibility/helpers/focusElement')

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

  it('should not display "Voir plus" button when text only exceeds the limit with trailing whitespace', () => {
    render(<CollapsibleText text={`${SHORT_TEXT}${' '.repeat(100)}`} maxChars={100} />)

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should not display "Voir moins" button when text is short', () => {
    render(<CollapsibleText text={SHORT_TEXT} maxChars={100} />)

    expect(screen.queryByText('Voir moins')).not.toBeOnTheScreen()
  })

  it('should display full text in a single text block when clicking on "Voir plus"', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    const button = screen.getByText('Voir plus')
    await user.press(button)

    expect(screen.getByText('Voir moins')).toBeOnTheScreen()
    expect(screen.getByText(LONG_TEXT, { includeHiddenElements: true })).toBeOnTheScreen()
  })

  it('should hide the displayed text from screen readers when expanded', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))

    expect(screen.queryByText(LONG_TEXT)).not.toBeOnTheScreen()
  })

  it('should expose the beginning and the continuation of the text to screen readers when expanded', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByLabelText(FIRST_PART_LABEL)).toBeOnTheScreen()
    expect(screen.getByLabelText(CONTINUATION_LABEL)).toBeOnTheScreen()
  })

  it('should move accessibility focus to the continuation when expanded', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />, {
      createNodeMock: (element) => element,
    })

    await user.press(screen.getByText('Voir plus'))

    await waitFor(() => expect(focusElement).toHaveBeenCalledTimes(1))

    expect(focusElement).toHaveBeenCalledWith({
      current: expect.objectContaining({
        props: expect.objectContaining({ accessibilityLabel: CONTINUATION_LABEL }),
      }),
    })
  })

  it('should position the accessible zones on the lines of the displayed text', async () => {
    render(<CollapsibleText text={LONG_TEXT} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))
    fireEvent(screen.getByText(LONG_TEXT, { includeHiddenElements: true }), 'textLayout', {
      nativeEvent: {
        lines: [
          { text: LONG_TEXT.slice(0, 64), y: 0, height: LINE_HEIGHT },
          { text: LONG_TEXT.slice(64, 128), y: LINE_HEIGHT, height: LINE_HEIGHT },
          { text: LONG_TEXT.slice(128), y: 2 * LINE_HEIGHT, height: LINE_HEIGHT },
        ],
      },
    })

    expect(screen.getByLabelText(FIRST_PART_LABEL)).toHaveStyle({
      top: 0,
      height: 2 * LINE_HEIGHT,
    })
    expect(screen.getByLabelText(CONTINUATION_LABEL)).toHaveStyle({
      top: LINE_HEIGHT,
      height: 2 * LINE_HEIGHT,
    })
  })

  it('should take the displayed url of the links into account when positioning the accessible zones', async () => {
    render(<CollapsibleText text={TEXT_WITH_LINK_IN_FIRST_PART} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))
    fireEvent(
      screen.getByText(RENDERED_TEXT_WITH_LINK, { includeHiddenElements: true }),
      'textLayout',
      {
        nativeEvent: {
          lines: [
            {
              text: RENDERED_TEXT_WITH_LINK.slice(0, RENDERED_LINK_CUT_INDEX),
              y: 0,
              height: LINE_HEIGHT,
            },
            {
              text: RENDERED_TEXT_WITH_LINK.slice(RENDERED_LINK_CUT_INDEX),
              y: LINE_HEIGHT,
              height: LINE_HEIGHT,
            },
          ],
        },
      }
    )

    expect(
      screen.getByLabelText(TEXT_WITH_LINK_IN_FIRST_PART.slice(0, LINK_CUT_INDEX).trim())
    ).toHaveStyle({ top: 0, height: LINE_HEIGHT })
    expect(
      screen.getByLabelText(TEXT_WITH_LINK_IN_FIRST_PART.slice(LINK_CUT_INDEX).trim())
    ).toHaveStyle({ top: LINE_HEIGHT, height: LINE_HEIGHT })
  })

  it('should expose an accessibility action to open each link of the continuation', async () => {
    render(<CollapsibleText text={TEXT_WITH_LINK} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))

    const continuation = screen.getByLabelText(/Plus d’infos sur www\.example\.com/)

    expect(continuation).toHaveProp('accessibilityActions', [
      { name: 'openLink0', label: 'Ouvrir le lien www.example.com' },
    ])
  })

  it('should open the link when its accessibility action is triggered', async () => {
    render(<CollapsibleText text={TEXT_WITH_LINK} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))
    fireEvent(screen.getByLabelText(/Plus d’infos sur www\.example\.com/), 'accessibilityAction', {
      nativeEvent: { actionName: 'openLink0' },
    })

    expect(openUrl).toHaveBeenCalledWith('http://www.example.com', undefined, true)
  })

  it('should strip markdown from the accessibility labels', async () => {
    render(<CollapsibleText text={TEXT_WITH_LINK} maxChars={100} />)

    await user.press(screen.getByText('Voir plus'))

    expect(
      screen.getByLabelText(/Plus d’infos sur www\.example\.com pour la suite\.$/)
    ).toBeOnTheScreen()
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
