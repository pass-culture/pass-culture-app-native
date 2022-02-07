const SPECIAL_CHARACTER_AT_THE_BEGINNING_OR_END_REGEX = /^['-]|['-]$/
const NUMBER_REGEX = /[0-9]+/
const LATIN_REGEX = /\p{sc=Latin}|[',-.’ ]/gu

export function isNameValid(name: string) {
  const trimmedName = name.trim()
  return (
    trimmedName.length > 0 &&
    containsOnlyLatinCharacters(trimmedName) &&
    !containsNumber(trimmedName) &&
    !containsSpecialCharacterAtTheBeginningOrEnd(trimmedName)
  )
}

function containsOnlyLatinCharacters(name: string) {
  return name.match(LATIN_REGEX)?.length === name.length
}

function containsNumber(name: string): boolean {
  return NUMBER_REGEX.test(name)
}

function containsSpecialCharacterAtTheBeginningOrEnd(name: string): boolean {
  return SPECIAL_CHARACTER_AT_THE_BEGINNING_OR_END_REGEX.test(name)
}
