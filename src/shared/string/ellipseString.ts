export const ellipseString = (string: string, maximumCharacters: number): string => {
  return string.length <= maximumCharacters ? string : string.slice(0, maximumCharacters) + '...'
}
