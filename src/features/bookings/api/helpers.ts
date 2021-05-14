import { t } from '@lingui/macro'

import { isApiError } from 'api/helpers'

export function extractApiErrorMessage(error: unknown) {
  let message = t`Une erreur est survenue`
  if (isApiError(error)) {
    const { content } = error as { content: { code: string; message: string } }
    if (content && content.code && content.message) {
      message = content.message
    }
  }

  return message
}
