import React from 'react'

import { render, screen } from 'tests/utils'
import { Markdown } from 'ui/components/Markdown/Markdown'
import { Typo } from 'ui/theme'

const TEXT =
  'Lorem **ipsum dolor** sit amet, consectetur _adipiscing_ elit. Maecenas nec tellus in magna convallis egestas eget **_id justo_**. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor.'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('Markdown', () => {
  it('should render text with different styles', () => {
    render(<Markdown>{TEXT}</Markdown>)

    expect(screen.getByText('Lorem')).toHaveProp('testID', 'styledBody')
    expect(screen.getByText('ipsum dolor')).toHaveProp('testID', 'styledBodyAccent')
    expect(screen.getByText('adipiscing')).toHaveProp('testID', 'styledBodyItalic')
    expect(screen.getByText('id justo')).toHaveProp('testID', 'styledBodyItalicAccent')
  })

  it('should not render text when children is not a string', () => {
    render(
      <Markdown>
        <Typo.Body>Lorem</Typo.Body>
      </Markdown>
    )

    expect(screen.queryByText('Lorem')).not.toBeOnTheScreen()
  })
})
