import { TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

export const isHeadingLevel = (
  level: unknown
): level is Exclude<TextSemanticLevel, 'p' | 'span'> => {
  return typeof level === 'number' && [1, 2, 3, 4].includes(level)
}
