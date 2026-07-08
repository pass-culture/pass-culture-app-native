import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const contentfulIllustrationNames = [
  'museum',
  'art',
  'onlineEvent',
  'classicalMusic',
  'litterature',
  'movie&series',
  'concert',
  'show',
  'game',
  'cinema',
  'media&press',
  'free',
] as const

export type ContentfulIllustrationName = (typeof contentfulIllustrationNames)[number]

export const buildContentfulIllustrationUrl = (illustrationName: ContentfulIllustrationName) =>
  buildCategoryIllustrationUrl(`${illustrationName}.png`)
