import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'

export const snakeCaseToUppercaseFirstLetter = (snakeCase: string): string => {
  const capitalizedString = capitalizeFirstLetter(snakeCase)
  return capitalizedString.replace(/_/g, ' ')
}
