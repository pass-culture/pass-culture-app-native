import { useMutation } from '@tanstack/react-query'

import {
  ALGOLIA_PRODUCTION_APPLICATION_ID,
  ALGOLIA_PRODUCTION_SEARCH_API_KEY,
  buildCompletionUrl,
  COMPLETION_TIMEOUT_IN_MS,
} from 'cheatcodes/pages/features/conversationalSearch/constants'
import { parseCompletionStream } from 'cheatcodes/pages/features/conversationalSearch/helpers/parseCompletionStream'
import { ConversationMessage } from 'cheatcodes/pages/features/conversationalSearch/types'

type ConversationalSearchParams = {
  agentId: string
  conversationId: string
  messages: ConversationMessage[]
}

type ConversationalSearchResult = {
  raw: unknown
  durationInMs: number
}

const MAX_ERROR_BODY_LENGTH = 300

const postAgentCompletion = async ({
  agentId,
  conversationId,
  messages,
}: ConversationalSearchParams): Promise<ConversationalSearchResult> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), COMPLETION_TIMEOUT_IN_MS)
  const startedAt = Date.now()

  try {
    const response = await fetch(buildCompletionUrl(agentId), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-algolia-application-id': ALGOLIA_PRODUCTION_APPLICATION_ID,
        'x-algolia-api-key': ALGOLIA_PRODUCTION_SEARCH_API_KEY,
      },
      body: JSON.stringify({ id: conversationId, messages }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Agent Studio a répondu ${response.status}\u00a0: ${errorBody.slice(0, MAX_ERROR_BODY_LENGTH)}`
      )
    }

    const raw = parseCompletionStream(await response.text())
    return { raw, durationInMs: Date.now() - startedAt }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Pas de réponse après ${COMPLETION_TIMEOUT_IN_MS / 1000} secondes`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export const useConversationalSearchMutation = () =>
  useMutation({ mutationFn: postAgentCompletion })
