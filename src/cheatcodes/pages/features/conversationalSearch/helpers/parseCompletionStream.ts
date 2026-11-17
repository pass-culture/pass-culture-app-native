import {
  isRecord,
  UnknownRecord,
} from 'cheatcodes/pages/features/conversationalSearch/helpers/isRecord'

const DATA_PREFIX = 'data:'
const DONE_MARKER = '[DONE]'
const UNKNOWN_TOOL_NAME = 'unknown'

type AssistantMessage = {
  role: 'assistant'
  parts: unknown[]
}

const toEvent = (line: string): UnknownRecord | undefined => {
  if (!line.startsWith(DATA_PREFIX)) return undefined
  const payload = line.slice(DATA_PREFIX.length).trim()
  if (!payload || payload === DONE_MARKER) return undefined
  try {
    const event: unknown = JSON.parse(payload)
    return isRecord(event) ? event : undefined
  } catch {
    return undefined
  }
}

const toErrorMessage = (event: UnknownRecord): string =>
  typeof event.errorText === 'string' ? event.errorText : JSON.stringify(event)

export const parseCompletionStream = (body: string): AssistantMessage => {
  const events = body
    .split('\n')
    .map(toEvent)
    .filter((event): event is UnknownRecord => !!event)

  const toolCalls = new Map<string, { toolName: string; input: unknown }>()
  const parts: unknown[] = []
  let text = ''

  events.forEach((event) => {
    const toolCallId = typeof event.toolCallId === 'string' ? event.toolCallId : ''

    if (event.type === 'error') throw new Error(toErrorMessage(event))

    if (event.type === 'tool-input-available') {
      const toolName = typeof event.toolName === 'string' ? event.toolName : UNKNOWN_TOOL_NAME
      toolCalls.set(toolCallId, { toolName, input: event.input })
    }

    if (event.type === 'tool-output-available') {
      const toolCall = toolCalls.get(toolCallId)
      parts.push({
        type: `tool-${toolCall?.toolName ?? UNKNOWN_TOOL_NAME}`,
        toolCallId,
        state: 'output-available',
        input: toolCall?.input,
        output: event.output,
      })
    }

    if (event.type === 'text-delta' && typeof event.delta === 'string') text += event.delta
  })

  if (text) parts.push({ type: 'text', text })
  if (!parts.length) throw new Error('L’agent n’a renvoyé ni texte ni résultat')

  return { role: 'assistant', parts }
}
