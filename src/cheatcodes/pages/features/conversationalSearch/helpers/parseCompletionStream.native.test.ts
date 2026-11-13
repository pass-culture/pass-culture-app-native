import {
  agentStudioCompletionStream,
  toCompletionStream,
} from 'cheatcodes/pages/features/conversationalSearch/fixtures/agentStudioCompletionStream'

import { parseCompletionStream } from './parseCompletionStream'

describe('parseCompletionStream', () => {
  it('should rebuild one part per search followed by the answer text', () => {
    const { role, parts } = parseCompletionStream(agentStudioCompletionStream)

    expect(role).toEqual('assistant')
    expect(parts).toEqual([
      expect.objectContaining({ type: 'tool-algolia_search_index_production' }),
      expect.objectContaining({ type: 'tool-algolia_search_index_production' }),
      expect.objectContaining({ type: 'text' }),
    ])
  })

  it('should attach the input and the output of each search', () => {
    const { parts } = parseCompletionStream(agentStudioCompletionStream)

    expect(parts[0]).toEqual({
      type: 'tool-algolia_search_index_production',
      toolCallId: 'cb613552-59c7-4c94-a8ae-c3ba08893825',
      state: 'output-available',
      input: expect.objectContaining({ originalQuery: 'plutôt du rap à Lyon' }),
      output: expect.objectContaining({ nbHits: 16 }),
    })
  })

  it('should concatenate the text received in several chunks', () => {
    const { parts } = parseCompletionStream(agentStudioCompletionStream)

    expect(parts[2]).toEqual({
      type: 'text',
      text: expect.stringMatching(/^Si tu as envie de rap[\s\S]*Laquelle de ces ambiances/),
    })
  })

  it('should ignore lines that are not valid events', () => {
    const stream = `: keep-alive\n\ndata: not-json\n\n${toCompletionStream([
      { type: 'text-delta', id: 'alg_msg_test', delta: 'Bonjour' },
    ])}`

    expect(parseCompletionStream(stream).parts).toEqual([{ type: 'text', text: 'Bonjour' }])
  })

  it('should throw the error sent in the stream', () => {
    const stream = toCompletionStream([
      { type: 'start-step' },
      { type: 'error', errorText: 'Max steps per completion limit was reached' },
    ])

    expect(() => parseCompletionStream(stream)).toThrow(
      'Max steps per completion limit was reached'
    )
  })

  it('should throw when the stream contains neither text nor search', () => {
    const stream = toCompletionStream([{ type: 'start' }, { type: 'finish' }])

    expect(() => parseCompletionStream(stream)).toThrow('L’agent n’a renvoyé ni texte ni résultat')
  })
})
