const EXCLUDE_SPECIAL_CHARACTER_REGEX = /[`!@#$%^&*()_+=[\]{};:"\\|<>/?~¿§«»ω⊙¤°℃℉€¥£¢¡®©]/
const EXCLUDE_SPECIAL_CHARACTER_AT_THE_BEGINNING_OR_END_REGEX = /^['-]|['-]$/
const NUMBER_REGEX = /[0-9]+/

export function isNameValid(name: string) {
  return (
    name.length > 0 &&
    !containsExcludeSpecialCharacter(name) &&
    !containsNumber(name) &&
    !containsSpecialCharacterAtTheBeginningOrEnd(name)
  )
}

function containsExcludeSpecialCharacter(name: string): boolean {
  return EXCLUDE_SPECIAL_CHARACTER_REGEX.test(name)
}

function containsNumber(name: string): boolean {
  return NUMBER_REGEX.test(name)
}

function containsSpecialCharacterAtTheBeginningOrEnd(name: string): boolean {
  return EXCLUDE_SPECIAL_CHARACTER_AT_THE_BEGINNING_OR_END_REGEX.test(name)
}
