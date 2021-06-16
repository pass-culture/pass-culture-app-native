const ALPHA_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz'
const CAPITAL_ALPHA_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMERIC_CHARACTERS = '0123456789'
const SPECIAL_CHARACTERS = ',;:!?.(){}'

export function randomAlphaString(nChars = 8) {
  let text = ''
  for (let i = 0; i < nChars; i++) {
    text += ALPHA_CHARACTERS.charAt(Math.floor(Math.random() * ALPHA_CHARACTERS.length))
  }
  return text
}

export function randomPassword(
  nChars = 3,
  nCapitalChars = 3,
  nNumericChars = 3,
  nSpecialChars = 3
) {
  const chars = [ALPHA_CHARACTERS, CAPITAL_ALPHA_CHARACTERS, NUMERIC_CHARACTERS, SPECIAL_CHARACTERS]
  return [nChars, nCapitalChars, nNumericChars, nSpecialChars]
    .map(function (len, i) {
      return Array(len)
        .fill(chars[i])
        .map(function (x) {
          return x[Math.floor(Math.random() * x.length)]
        })
        .join('')
    })
    .concat()
    .join('')
    .split('')
    .sort(function () {
      return 0.5 - Math.random()
    })
    .join('')
}
