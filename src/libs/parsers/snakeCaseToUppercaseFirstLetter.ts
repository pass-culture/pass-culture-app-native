export const snakeCaseToUppercaseFirstLetter = (snakeCase: string): string => {
  const capitalizedString = snakeCase[0].toUpperCase() + snakeCase.slice(1)
  return capitalizedString.replace(/_/g, ' ')
}
