import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

export const contentfulIllustrationNames = [
  'art',
  'cinema',
  'classicalMusic',
  'concert',
  'free',
  'game',
  'litterature',
  'media&press',
  'movie&series',
  'museum',
  'onlineEvent',
  'photography',
  'show',
] as const

export type ContentfulIllustrationName = (typeof contentfulIllustrationNames)[number]

export const buildContentfulIllustrationUrl = (illustrationName: ContentfulIllustrationName) =>
  buildCategoryIllustrationUrl(`${illustrationName}.png`)
