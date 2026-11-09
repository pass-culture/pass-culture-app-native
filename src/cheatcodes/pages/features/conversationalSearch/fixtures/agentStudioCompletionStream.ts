import agentStudioCompletionEvents from './agentStudioCompletionEvents.json'

export const toCompletionStream = (events: unknown[]): string =>
  `${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')}data: [DONE]\n\n`

export const agentStudioCompletionStream = toCompletionStream(agentStudioCompletionEvents)
