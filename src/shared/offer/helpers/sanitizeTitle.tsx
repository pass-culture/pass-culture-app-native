import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'

export const sanitizeTitle = (title: string) => {
  const trimedTitle = title.trim()
  if (!trimedTitle) return ''

  return capitalizeFirstLetter(trimedTitle)
}
