import React from 'react'

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (node === null || node === undefined || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) {
    return node
      .map(extractTextFromReactNode)
      .filter((text) => text.trim().length > 0)
      .join(' ')
  }
  if (React.isValidElement(node)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = node as React.ReactElement<any>
    const { children, wording } = element.props || {}
    if (typeof wording === 'string') return wording
    return extractTextFromReactNode(children)
  }
  return ''
}
