import { TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

const HEADING_LEVELS = new Set(['h1', 'h2', 'h3', 'h4'])

export const isHeadingLevel = (
  level: TextSemanticLevel | undefined
): level is 'h1' | 'h2' | 'h3' | 'h4' => {
  return HEADING_LEVELS.has(level ?? '')
}
