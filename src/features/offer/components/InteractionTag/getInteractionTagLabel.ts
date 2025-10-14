import { ReactNode, isValidElement } from 'react'

export function getInteractionTagLabel(interactionTag: ReactNode): string | undefined {
  return isValidElement(interactionTag)
    ? (interactionTag.props as { label: string }).label
    : undefined
}
