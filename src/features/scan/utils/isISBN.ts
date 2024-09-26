export function checkIsISBN(input: string): boolean {
  // Remove any 'ISBN' prefix (case insensitive), trim and keep only digits and 'X'
  const cleanedInput = input.replace(/^ISBN\s*/i, '').replace(/[^0-9Xx]/g, '')

  if (cleanedInput.length === 10) {
    return isValidISBN10(cleanedInput)
  } else if (cleanedInput.length === 13) {
    return isValidISBN13(cleanedInput)
  }
  return false
}

const isValidISBN10 = (isbn: string): boolean => {
  if (isbn.length !== 10) return false

  const checksum = isbn
    .split('')
    .slice(0, 9)
    .reduce((sum, char, idx) => sum + parseInt(char) * (10 - idx), 0)

  const lastChar = isbn[9]?.toUpperCase()
  if (!lastChar) {
    return false
  }
  const checkDigit = lastChar === 'X' ? 10 : parseInt(lastChar)

  return !isNaN(checkDigit) && (checksum + checkDigit) % 11 === 0
}

const isValidISBN13 = (isbn: string): boolean => {
  if (isbn.length !== 13) return false

  const checksum = isbn
    .split('')
    .slice(0, 12)
    .reduce((sum, char, idx) => sum + parseInt(char) * (idx % 2 === 0 ? 1 : 3), 0)

  const digit = isbn[12]
  if (!digit) {
    return false
  }
  const checkDigit = parseInt(digit)
  return !isNaN(checkDigit) && (checksum + checkDigit) % 10 === 0
}
