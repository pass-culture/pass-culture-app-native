import { env } from 'libs/environment/env'

export const buildCategoryIllustrationUrl = (filename: string) =>
  `${env.ILLUSTRATIONS_BASE_URL}/${filename}`
