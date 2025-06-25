import { capitalize } from 'libs/formatter/capitalize'

export const snakeCaseToUppercaseFirstLetter = (snakeCase: string): string => {
  const capitalizedString = capitalize(snakeCase)
  return capitalizedString.replace(/_/g, ' ')
}
