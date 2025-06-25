import { capitalize } from 'libs/formatter/capitalize'

export const sanitizeTitle = (title: string) => {
  const trimedTitle = title.trim()
  if (!trimedTitle) return ''

  return capitalize(trimedTitle)
}
