const FRENCH_POSTAL_CODE_REGEX = /^[0-9 ]{5}$/

export function isPostalCodeValid(postalCode: string) {
  return FRENCH_POSTAL_CODE_REGEX.test(postalCode)
}
