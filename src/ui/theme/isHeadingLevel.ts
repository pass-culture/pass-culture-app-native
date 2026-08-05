import { HeadingLevel } from 'ui/theme/typographyAttrs/types'

export const isHeadingLevel = (level: unknown): level is Exclude<HeadingLevel, 'p'> => {
  return typeof level === 'number' && [1, 2, 3, 4].includes(level)
}
