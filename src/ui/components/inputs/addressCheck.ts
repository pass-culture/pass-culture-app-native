const ADDRESS_REGEX = /\p{sc=Latin}|[ \-,'.’]|[0-9]/gu // Latin characters, spaces and numbers

export function isAddressValid(name: string) {
  const trimmedName = name.trim()
  return trimmedName.length > 0 && containsOnlyLatinCharactersSpacesAndNumbers(trimmedName)
}

function containsOnlyLatinCharactersSpacesAndNumbers(name: string) {
  return name.match(ADDRESS_REGEX)?.length === name.length
}
