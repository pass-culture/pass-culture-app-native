import { agentStudioCompletionStream } from 'cheatcodes/pages/features/conversationalSearch/fixtures/agentStudioCompletionStream'
import { parseAgentCompletion } from 'cheatcodes/pages/features/conversationalSearch/helpers/parseAgentCompletion'
import { parseCompletionStream } from 'cheatcodes/pages/features/conversationalSearch/helpers/parseCompletionStream'

import { parseAnswerMarkdown } from './parseAnswerMarkdown'

describe('parseAnswerMarkdown', () => {
  it('should split paragraphs on blank lines and keep line breaks inside a paragraph', () => {
    expect(parseAnswerMarkdown('Bonjour\nà toi\n\nAu revoir')).toEqual([
      { type: 'paragraph', segments: [{ type: 'text', text: 'Bonjour\nà toi' }] },
      { type: 'paragraph', segments: [{ type: 'text', text: 'Au revoir' }] },
    ])
  })

  it('should read headings', () => {
    expect(parseAnswerMarkdown('### Mes idées')).toEqual([
      { type: 'heading', segments: [{ type: 'text', text: 'Mes idées' }] },
    ])
  })

  it('should read bold text and links inside a line', () => {
    expect(
      parseAnswerMarkdown(
        'Va voir **Le Transbordeur** : [la page](https://passculture.app/offre/1).'
      )
    ).toEqual([
      {
        type: 'paragraph',
        segments: [
          { type: 'text', text: 'Va voir ' },
          { type: 'bold', text: 'Le Transbordeur' },
          { type: 'text', text: ' : ' },
          { type: 'link', text: 'la page', url: 'https://passculture.app/offre/1' },
          { type: 'text', text: '.' },
        ],
      },
    ])
  })

  it('should read a two level list, even with blank lines between items', () => {
    expect(parseAnswerMarkdown('* Concert\n  * Lyon\n  - Gratuit\n\n- Expo')).toEqual([
      {
        type: 'list',
        items: [
          {
            segments: [{ type: 'text', text: 'Concert' }],
            nested: [[{ type: 'text', text: 'Lyon' }], [{ type: 'text', text: 'Gratuit' }]],
          },
          { segments: [{ type: 'text', text: 'Expo' }], nested: [] },
        ],
      },
    ])
  })

  it('should start a new list after a paragraph', () => {
    const blocks = parseAnswerMarkdown('* Un\n\nEntre deux\n\n* Deux')

    expect(blocks.map((block) => block.type)).toEqual(['list', 'paragraph', 'list'])
  })

  it('should keep unsupported markdown as plain text', () => {
    expect(parseAnswerMarkdown('1. _premier_ | `code`')).toEqual([
      { type: 'paragraph', segments: [{ type: 'text', text: '1. _premier_ | `code`' }] },
    ])
  })

  it('should structure a real answer of the agent', () => {
    const { text } = parseAgentCompletion(parseCompletionStream(agentStudioCompletionStream))

    const blocks = parseAnswerMarkdown(text)

    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'list', 'paragraph'])

    const list = blocks[1]

    expect(list?.type === 'list' ? list.items.map((item) => item.nested.length) : []).toEqual([
      4, 4, 4,
    ])
    expect(list?.type === 'list' ? list.items[0]?.nested[3] : []).toEqual([
      expect.objectContaining({ type: 'link', url: 'https://passculture.app/offre/436947318' }),
    ])
  })
})
