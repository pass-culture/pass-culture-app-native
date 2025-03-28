import { ReactElement, isValidElement } from 'react'

export function isReactElement(Icon: unknown): Icon is ReactElement {
  return isValidElement(Icon)
}
